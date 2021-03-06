﻿using System.Collections.Generic;
using System.Threading.Tasks;
using VoidJudge.Models.Identity;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Identity;
using Claim = System.Security.Claims.Claim;

namespace VoidJudge.Services.Auth
{
    public interface IAuthService
    {
        Task<ApiResult> LoginAsync(LoginUserViewModel loginUser, string ipAddress);
        Task<ApiResult> ResetPasswordAsync(ResetUserViewModel resetUser);
        Task<bool> IsUserExistAsync(long id);
        bool CompareRoleAuth(RoleType a, RoleType b);
        RoleType GetRoleTypeFromRequest(IEnumerable<Claim> claims);
        long GetUserIdFromRequest(IEnumerable<Claim> claims);
        string GetIpAddressFromRequest(IEnumerable<Claim> claims);
        Task<RoleModel> GetRoleFromRoleTypeAsync(RoleType roleType, bool isLoadUsers = false);
    }
}