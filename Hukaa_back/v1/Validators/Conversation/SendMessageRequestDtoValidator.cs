namespace Hukaa_back.Validators.Conversation;

public class SendMessageRequestDtoValidator : AbstractValidator<SendMessageRequestDto>
{
    public SendMessageRequestDtoValidator()
    {
        // ReceiverId məcburidir və UUID formatında olmalıdır
        RuleFor(x => x.ReceiverId)
            .NotEmpty().WithMessage("ReceiverId is required.")
            .Matches(@"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$")
            .WithMessage("ReceiverId must be a valid UUID.");

        RuleFor(x => x.PostId)
            .Matches(@"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$")
            .When(x => !string.IsNullOrWhiteSpace(x.PostId))
            .WithMessage("PostId must be a valid UUID.");

        // ConversationId varsa UUID olmalıdır
        RuleFor(x => x.ConversationId)
            .Matches(@"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$")
            .When(x => !string.IsNullOrWhiteSpace(x.ConversationId))
            .WithMessage("ConversationId must be a valid UUID.");

        RuleFor(x => x)
            .Must(x => !string.IsNullOrWhiteSpace(x.Content) || !string.IsNullOrWhiteSpace(x.PostId))
            .WithMessage("Either Content or PostId must be provided.");
    }
}