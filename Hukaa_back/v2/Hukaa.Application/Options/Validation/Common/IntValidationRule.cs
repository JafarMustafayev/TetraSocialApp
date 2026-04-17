namespace Hukaa.Application.Options.Validation.Common;

public sealed class IntValidationRule : ValidationRuleBase
{
    public int? MinValue { get; set; }
    public int? MaxValue { get; set; }
}