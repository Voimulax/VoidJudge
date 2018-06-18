using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models.System;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.System;

namespace VoidJudge.Services.System
{
    public class SettingsService : ISettingsService
    {
        private readonly VoidJudgeContext _context;
        private readonly IMapper _mapper;

        public SettingsService(VoidJudgeContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResult> GetSettingsAsync()
        {
            var settings = await _context.Settings.Select(s => _mapper.Map<SettingsModel, SettingsViewModel>(s))
                .ToListAsync();
            if (settings.Count < 1)
            {
                var result = await InitSettingsAsync();
                switch (result.Error)
                {
                    case GetSettingsResultType.Error:
                        return new GetSettingsResult { Error = GetSettingsResultType.Error };
                    case GetSettingsResultType.Ok:
                        settings = await _context.Settings.Select(s => _mapper.Map<SettingsModel, SettingsViewModel>(s))
                            .ToListAsync();
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
            return new GetSettingsResult { Error = GetSettingsResultType.Ok, Data = settings };
        }

        public IList<SettingsViewModel> GetSettings()
        {
            var settings = _context.Settings.Select(s => _mapper.Map<SettingsModel, SettingsViewModel>(s)).ToList();
            if (settings.Count < 1)
            {
                InitSettings();
                settings = _context.Settings.Select(s => _mapper.Map<SettingsModel, SettingsViewModel>(s)).ToList();
            }

            return settings;
        }

        public async Task<ApiResult> PutSettingsAsync(IList<SettingsViewModel> putSettings)
        {
            var settings = await _context.Settings.Select(s => _mapper.Map<SettingsModel, SettingsViewModel>(s))
                .ToListAsync();
            if (settings.Count < 1)
            {
                var result = await InitSettingsAsync();
                switch (result.Error)
                {
                    case GetSettingsResultType.Error:
                        return new GetSettingsResult { Error = PutSettingsResultType.Error };
                    case GetSettingsResultType.Ok:
                        settings = await _context.Settings.Select(s => _mapper.Map<SettingsModel, SettingsViewModel>(s))
                            .ToListAsync();
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
            putSettings.ToList().ForEach(ps =>
            {
                var s = settings.SingleOrDefault(ss => ss.Type == ps.Type);
                s.Value = ps.Value;
            });
            await _context.SaveChangesAsync();
            return new ApiResult { Error = PutSettingsResultType.Ok };
        }

        public async Task<ApiResult> InitSettingsAsync()
        {
            var settings = new SettingsModel { Type = SettingsType.UploadLimit, Value = "16384" };
            await _context.Settings.AddAsync(settings);
            await _context.SaveChangesAsync();
            return new ApiResult { Error = GetSettingsResultType.Ok };
        }

        public void InitSettings()
        {
            var settings = new SettingsModel { Type = SettingsType.UploadLimit, Value = "16384" };
            _context.Settings.Add(settings);
            _context.SaveChanges();
        }
    }
}