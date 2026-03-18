namespace Hukaa_back.Abstractions.Services.Dashboard;

public interface IAdminStatsService
{
    Task<ResponseDto> GetStatsAsync();
}
