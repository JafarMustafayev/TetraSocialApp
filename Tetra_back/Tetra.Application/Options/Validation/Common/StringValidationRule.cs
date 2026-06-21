namespace Tetra.Application.Options.Validation.Common;

public sealed class StringValidationRule : ValidationRuleBase
{
    public int? MinLength { get; set; }
    public int? MaxLength { get; set; }
}