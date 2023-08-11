DROP TABLE SquirrelData;

CREATE TABLE SquirrelData (
    X DECIMAL(10, 7),
    Y DECIMAL(10, 7),
    UniqueSquirrelID VARCHAR(255),
    Hectare VARCHAR(255),
    Shift VARCHAR(255),
    Date INTEGER,
    HectareSquirrelNumber INTEGER,
    Age VARCHAR(255),
    PrimaryFurColor VARCHAR(255),
    HighlightFurColor VARCHAR(255),
    CombinationOfColors VARCHAR(255),
    ColorNotes VARCHAR(255),
    Location VARCHAR(255),
    AboveGroundSighterMeasurement VARCHAR(255),
    SpecificLocation VARCHAR(255),
    Running BOOLEAN,
    Chasing BOOLEAN,
    Climbing BOOLEAN,
    Eating BOOLEAN,
    Foraging BOOLEAN,
    OtherActivities VARCHAR(255),
    Kuks BOOLEAN,
    Quaas BOOLEAN,
    Moans BOOLEAN,
    TailFlags BOOLEAN,
    TailTwitches BOOLEAN,
    Approaches BOOLEAN,
    Indifferent BOOLEAN,
    RunsFrom BOOLEAN,
    OtherInteractions TEXT,
    LatLon VARCHAR(255),
    ZipCodes INTEGER,
    CommunityDistricts INTEGER,
    BoroughBoundaries INTEGER,
    CityCouncilDistricts INTEGER,
    PolicePrecincts INTEGER
);
