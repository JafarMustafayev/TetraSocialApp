namespace Hukaa.Application.Options.ValidationRules.FieldRuleOptions;

public sealed class FieldRule
{
    public bool Required { get; set; }
    public int? MinLength { get; set; }
    public int? MaxLength { get; set; }
}