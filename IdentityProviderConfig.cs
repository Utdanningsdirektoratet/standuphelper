namespace StandupHelper
{
    public class IdentityProviderConfig
    {
        public string Authority { get; set; } = default!;
        public string ClientId { get; set; } = default!;
        public string ClientSecret { get; set; } = default!;
    }
}