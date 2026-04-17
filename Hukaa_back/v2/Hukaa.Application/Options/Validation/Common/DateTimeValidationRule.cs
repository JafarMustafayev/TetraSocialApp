namespace Hukaa.Application.Options.Validation.Common;

public sealed class DateTimeValidationRule : ValidationRuleBase
{
    public DateTime? MinDate { get; set; }
    public DateTime? MaxDate { get; set; }
    public bool MustBePast { get; set; }
    public bool MustBeFuture { get; set; }
}