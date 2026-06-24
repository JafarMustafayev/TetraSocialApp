namespace Tetra.Application.Validators;

public static class ValidationRuleBuilderExtensions
{
    public static IRuleBuilderOptions<T, string> ApplyStringValidation<T>(
        this IRuleBuilder<T, string> ruleBuilder,
        StringValidationRule rule,
        ILocalizationService localizer,
        string propertyName)
    {
        var builder = ruleBuilder;

        if(rule.Required)
        {
            builder = builder
                .NotEmpty()
                .WithMessage(localizer.Get("Validation.Common.Validation.Required", propertyName));
        }

        if(rule.MinLength.HasValue)
        {
            builder = builder
                .MinimumLength(rule.MinLength.Value)
                .WithMessage(localizer.Get(
                    "Validation.Common.Validation.MinLength",
                    propertyName,
                    new Dictionary<string, object>
                    {
                        ["MinLength"] = rule.MinLength.Value
                    }));
        }

        if(rule.MaxLength.HasValue)
        {
            builder = builder
                .MaximumLength(rule.MaxLength.Value)
                .WithMessage(localizer.Get(
                    "Validation.Common.Validation.MaxLength",
                    propertyName,
                    new Dictionary<string, object>
                    {
                        ["MaxLength"] = rule.MaxLength.Value
                    }));
        }

        return (IRuleBuilderOptions<T, string>)builder;
    }

    public static IRuleBuilderOptions<T, DateTime> ApplyDateTimeValidation<T>(
        this IRuleBuilder<T, DateTime> ruleBuilder,
        DateTimeValidationRule rule,
        ILocalizationService localizer,
        string propertyName)
    {
        var builder = ruleBuilder;

        if(rule.Required)
        {
            builder = builder
                .NotEmpty()
                .WithMessage(localizer.Get("Validation.Common.Validation.Required", propertyName));
        }

        if(rule.MinDate.HasValue)
        {
            builder = builder
                .GreaterThanOrEqualTo(rule.MinDate.Value)
                .WithMessage(localizer.Get(
                    "Validation.Common.Validation.MinDate",
                    propertyName,
                    new Dictionary<string, object>
                    {
                        ["MinDate"] = rule.MinDate.Value
                    }));
        }

        if(rule.MaxDate.HasValue)
        {
            builder = builder
                .LessThanOrEqualTo(rule.MaxDate.Value)
                .WithMessage(localizer.Get(
                    "Validation.Common.Validation.MaxDate",
                    propertyName,
                    new Dictionary<string, object>
                    {
                        ["MaxDate"] = rule.MaxDate.Value
                    }));
        }

        if(rule.MustBePast)
        {
            builder = builder
                .LessThan(DateTime.UtcNow.Date)
                .WithMessage(localizer.Get("Validation.Common.Validation.MustBePast", propertyName));
        }

        if(rule.MustBeFuture)
        {
            builder = builder
                .GreaterThan(DateTime.UtcNow.Date)
                .WithMessage(localizer.Get("Validation.Common.Validation.MustBeFuture", propertyName));
        }

        return (IRuleBuilderOptions<T, DateTime>)builder;
    }

    public static IRuleBuilderOptions<T, DateOnly> ApplyDateOnlyValidation<T>(
        this IRuleBuilder<T, DateOnly> ruleBuilder,
        DateTimeValidationRule rule,
        ILocalizationService localizer,
        string propertyName)
    {
        var builder = ruleBuilder;

        if(rule.Required)
        {
            builder = builder
                .NotEmpty()
                .WithMessage(localizer.Get(
                    "Validation.Common.Validation.Required",
                    propertyName));
        }

        if(rule.MinDate.HasValue)
        {
            var minDate = DateOnly.FromDateTime(rule.MinDate.Value);

            builder = builder
                .GreaterThanOrEqualTo(minDate)
                .WithMessage(localizer.Get(
                    "Validation.Common.Validation.MinDate",
                    propertyName,
                    new Dictionary<string, object>
                    {
                        ["MinDate"] = minDate
                    }));
        }

        if(rule.MaxDate.HasValue)
        {
            var maxDate = DateOnly.FromDateTime(rule.MaxDate.Value);

            builder = builder
                .LessThanOrEqualTo(maxDate)
                .WithMessage(localizer.Get(
                    "Validation.Common.Validation.MaxDate",
                    propertyName,
                    new Dictionary<string, object>
                    {
                        ["MaxDate"] = maxDate
                    }));
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        if(rule.MustBePast)
        {
            builder = builder
                .LessThan(today)
                .WithMessage(localizer.Get(
                    "Validation.Common.Validation.MustBePast",
                    propertyName));
        }

        if(rule.MustBeFuture)
        {
            builder = builder
                .GreaterThan(today)
                .WithMessage(localizer.Get(
                    "Validation.Common.Validation.MustBeFuture",
                    propertyName));
        }

        return (IRuleBuilderOptions<T, DateOnly>)builder;
    }

    public static IRuleBuilderOptions<T, int> ApplyIntValidation<T>(
        this IRuleBuilder<T, int> ruleBuilder,
        IntValidationRule rule,
        ILocalizationService localizer,
        string propertyName)
    {
        var builder = ruleBuilder;

        if(rule.Required)
        {
            builder = builder
                .NotEmpty()
                .WithMessage(localizer.Get("Validation.Common.Validation.Required", propertyName));
        }

        if(rule.MinValue.HasValue)
        {
            builder = builder
                .GreaterThan(rule.MinValue.Value)
                .WithMessage(localizer.Get(
                    "Validation.Common.Validation.MinValue",
                    propertyName,
                    new Dictionary<string, object>
                    {
                        ["MinValue"] = rule.MinValue
                    }));
        }

        if(rule.MaxValue.HasValue)
        {
            builder = builder
                .LessThan(rule.MaxValue.Value)
                .WithMessage(localizer.Get(
                    "Validation.Common.Validation.MaxValue",
                    propertyName,
                    new Dictionary<string, object>
                    {
                        ["MaxValue"] = rule.MaxValue
                    }));
        }

        return (IRuleBuilderOptions<T, int>)builder;
    }
}