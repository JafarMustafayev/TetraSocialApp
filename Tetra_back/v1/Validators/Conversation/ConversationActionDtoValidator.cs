namespace Hukaa_back.Validators.Conversation;

public class ConversationActionDtoValidator : AbstractValidator<ConversationActionDto>
{
    public ConversationActionDtoValidator()
    {
        RuleFor(x => x.ConversationId)
            .NotNull().NotEmpty()
            .NotEmpty().WithMessage("ConversationId is required.")
            .Matches(@"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$")
            .WithMessage("ConversationId must be a valid UUID.");
    }
}