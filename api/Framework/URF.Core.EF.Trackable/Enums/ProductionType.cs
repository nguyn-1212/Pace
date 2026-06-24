namespace URF.Core.EF.Trackable.Enums
{
    public enum ProductionType
    {
        Dev,
        Stag,
        Production
    }

    public static class EnvironmentType
    {
        public static string Stag = "Staging";
        public static string Dev = "Development";
        public static string Production = "Production";
    }
}
