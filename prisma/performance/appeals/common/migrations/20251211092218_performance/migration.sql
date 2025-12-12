BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Appeal] (
    [id] INT NOT NULL IDENTITY(1,1),
    [reference] NVARCHAR(1000) NOT NULL,
    [submissionId] NVARCHAR(1000),
    [appealTypeId] INT,
    [procedureTypeId] INT,
    [addressId] INT,
    [lpaId] INT NOT NULL,
    [applicationReference] NVARCHAR(1000),
    [caseCreatedDate] DATETIME2 NOT NULL CONSTRAINT [Appeal_caseCreatedDate_df] DEFAULT CURRENT_TIMESTAMP,
    [caseUpdatedDate] DATETIME2 NOT NULL CONSTRAINT [Appeal_caseUpdatedDate_df] DEFAULT CURRENT_TIMESTAMP,
    [caseValidDate] DATETIME2,
    [caseExtensionDate] DATETIME2,
    [caseStartedDate] DATETIME2,
    [casePublishedDate] DATETIME2,
    [caseCompletedDate] DATETIME2,
    [withdrawalRequestDate] DATETIME2,
    [caseResubmittedTypeId] INT,
    [caseTransferredId] NVARCHAR(1000),
    [eiaScreeningRequired] BIT,
    [allocationId] INT,
    [appellantId] INT,
    [agentId] INT,
    [caseOfficerUserId] INT,
    [inspectorUserId] INT,
    [padsInspectorUserId] NVARCHAR(1000),
    [assignedTeamId] INT,
    CONSTRAINT [Appeal_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Appeal_reference_key] UNIQUE NONCLUSTERED ([reference])
);

-- CreateTable
CREATE TABLE [dbo].[AppealRelationship] (
    [id] INT NOT NULL IDENTITY(1,1),
    [type] NVARCHAR(1000) NOT NULL CONSTRAINT [AppealRelationship_type_df] DEFAULT 'linked',
    [parentRef] NVARCHAR(1000) NOT NULL,
    [childRef] NVARCHAR(1000) NOT NULL,
    [parentId] INT,
    [childId] INT,
    [externalSource] BIT,
    [externalAppealType] NVARCHAR(1000),
    [externalId] NVARCHAR(1000),
    [linkingDate] DATETIME2 NOT NULL CONSTRAINT [AppealRelationship_linkingDate_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [AppealRelationship_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AppealType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [type] NVARCHAR(1000) NOT NULL,
    [changeAppealType] NVARCHAR(1000),
    [key] NVARCHAR(1000) NOT NULL,
    [processCode] NVARCHAR(1000),
    [enabled] BIT,
    CONSTRAINT [AppealType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealType_type_key] UNIQUE NONCLUSTERED ([type]),
    CONSTRAINT [AppealType_key_key] UNIQUE NONCLUSTERED ([key])
);

-- CreateTable
CREATE TABLE [dbo].[AppealTimetable] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [caseResubmissionDueDate] DATETIME2,
    [lpaQuestionnaireDueDate] DATETIME2,
    [ipCommentsDueDate] DATETIME2,
    [appellantStatementDueDate] DATETIME2,
    [lpaStatementDueDate] DATETIME2,
    [finalCommentsDueDate] DATETIME2,
    [s106ObligationDueDate] DATETIME2,
    [issueDeterminationDate] DATETIME2,
    [statementOfCommonGroundDueDate] DATETIME2,
    [planningObligationDueDate] DATETIME2,
    [proofOfEvidenceAndWitnessesDueDate] DATETIME2,
    CONSTRAINT [AppealTimetable_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealTimetable_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[AppealStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [AppealStatus_status_df] DEFAULT 'assign_case_officer',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AppealStatus_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [valid] BIT NOT NULL CONSTRAINT [AppealStatus_valid_df] DEFAULT 1,
    [appealId] INT NOT NULL,
    [subStateMachineName] NVARCHAR(1000),
    [compoundStateName] NVARCHAR(1000),
    CONSTRAINT [AppealStatus_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AppealAllocation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [level] NVARCHAR(1000) NOT NULL,
    [band] INT NOT NULL,
    CONSTRAINT [AppealAllocation_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealAllocation_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[AppealSpecialism] (
    [id] INT NOT NULL IDENTITY(1,1),
    [specialismId] INT NOT NULL,
    [appealId] INT NOT NULL,
    CONSTRAINT [AppealSpecialism_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Specialism] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Specialism_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Specialism_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[ProcedureType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [key] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ProcedureType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ProcedureType_key_key] UNIQUE NONCLUSTERED ([key]),
    CONSTRAINT [ProcedureType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[LPA] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [lpaCode] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [teamId] INT,
    CONSTRAINT [LPA_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPA_lpaCode_key] UNIQUE NONCLUSTERED ([lpaCode])
);

-- CreateTable
CREATE TABLE [dbo].[ServiceUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [organisationName] NVARCHAR(1000),
    [salutation] NVARCHAR(1000),
    [firstName] NVARCHAR(1000),
    [middleName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [website] NVARCHAR(1000),
    [phoneNumber] NVARCHAR(1000),
    [addressId] INT,
    CONSTRAINT [ServiceUser_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [azureAdUserId] NVARCHAR(1000),
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_azureAdUserId_key] UNIQUE NONCLUSTERED ([azureAdUserId])
);

-- CreateTable
CREATE TABLE [dbo].[Address] (
    [id] INT NOT NULL IDENTITY(1,1),
    [addressLine1] NVARCHAR(1000),
    [addressLine2] NVARCHAR(1000),
    [postcode] NVARCHAR(1000),
    [addressCounty] NVARCHAR(1000),
    [addressTown] NVARCHAR(1000),
    [addressCountry] NVARCHAR(1000) CONSTRAINT [Address_addressCountry_df] DEFAULT 'United Kingdom',
    CONSTRAINT [Address_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[NeighbouringSite] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [addressId] INT NOT NULL,
    [source] NVARCHAR(1000) NOT NULL CONSTRAINT [NeighbouringSite_source_df] DEFAULT 'back-office',
    CONSTRAINT [NeighbouringSite_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [NeighbouringSite_appealId_addressId_key] UNIQUE NONCLUSTERED ([appealId],[addressId])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCase] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [appellantCaseValidationOutcomeId] INT,
    [applicationDate] DATETIME2 NOT NULL CONSTRAINT [AppellantCase_applicationDate_df] DEFAULT CURRENT_TIMESTAMP,
    [applicationDecision] NVARCHAR(1000) NOT NULL CONSTRAINT [AppellantCase_applicationDecision_df] DEFAULT 'refused',
    [applicationDecisionDate] DATETIME2,
    [caseSubmittedDate] DATETIME2 NOT NULL CONSTRAINT [AppellantCase_caseSubmittedDate_df] DEFAULT CURRENT_TIMESTAMP,
    [caseSubmissionDueDate] DATETIME2,
    [siteAccessDetails] NVARCHAR(1000),
    [siteSafetyDetails] NVARCHAR(1000),
    [siteAreaSquareMetres] DECIMAL(32,16),
    [floorSpaceSquareMetres] DECIMAL(32,16),
    [ownsAllLand] BIT,
    [ownsSomeLand] BIT,
    [knowsOtherOwnersId] INT,
    [knowsAllOwnersId] INT,
    [hasAdvertisedAppeal] BIT,
    [appellantCostsAppliedFor] BIT,
    [originalDevelopmentDescription] NVARCHAR(1000),
    [changedDevelopmentDescription] BIT,
    [ownersInformed] BIT,
    [enforcementNotice] BIT,
    [isGreenBelt] BIT,
    [agriculturalHolding] BIT,
    [tenantAgriculturalHolding] BIT,
    [otherTenantsAgriculturalHolding] BIT,
    [informedTenantsAgriculturalHolding] BIT,
    [appellantProcedurePreference] NVARCHAR(1000),
    [appellantProcedurePreferenceDetails] NVARCHAR(1000),
    [appellantProcedurePreferenceDuration] INT,
    [appellantProcedurePreferenceWitnessCount] INT,
    [planningObligation] BIT,
    [statusPlanningObligation] NVARCHAR(1000),
    [siteViewableFromRoad] BIT,
    [caseworkReason] NVARCHAR(1000),
    [developmentType] NVARCHAR(1000),
    [jurisdiction] NVARCHAR(1000),
    [numberOfResidencesNetChange] INT,
    [siteGridReferenceEasting] NVARCHAR(1000),
    [siteGridReferenceNorthing] NVARCHAR(1000),
    [typeOfPlanningApplication] NVARCHAR(1000),
    [enforcementNoticeListedBuilding] BIT,
    [enforcementIssueDate] DATETIME2,
    [enforcementEffectiveDate] DATETIME2,
    [contactPlanningInspectorateDate] DATETIME2,
    [enforcementReference] NVARCHAR(1000),
    [interestInLand] NVARCHAR(1000),
    [writtenOrVerbalPermission] NVARCHAR(1000),
    [descriptionOfAllegedBreach] NVARCHAR(1000),
    [contactAddressId] INT,
    [landownerPermission] BIT,
    CONSTRAINT [AppellantCase_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCase_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[AppealGround] (
    [id] INT NOT NULL IDENTITY(1,1),
    [groundId] INT,
    [appealId] INT,
    [factsForGround] NVARCHAR(1000),
    CONSTRAINT [AppealGround_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealGround_groundId_appealId_key] UNIQUE NONCLUSTERED ([groundId],[appealId])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseValidationOutcome] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AppellantCaseValidationOutcome_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCaseValidationOutcome_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseIncompleteReason] (
    [id] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [hasText] BIT NOT NULL CONSTRAINT [AppellantCaseIncompleteReason_hasText_df] DEFAULT 0,
    CONSTRAINT [AppellantCaseIncompleteReason_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCaseIncompleteReason_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseInvalidReason] (
    [id] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [hasText] BIT NOT NULL CONSTRAINT [AppellantCaseInvalidReason_hasText_df] DEFAULT 0,
    CONSTRAINT [AppellantCaseInvalidReason_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCaseInvalidReason_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseIncompleteReasonsSelected] (
    [appellantCaseIncompleteReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseIncompleteReasonsSelected_pkey] PRIMARY KEY CLUSTERED ([appellantCaseIncompleteReasonId],[appellantCaseId])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseInvalidReasonsSelected] (
    [appellantCaseInvalidReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseInvalidReasonsSelected_pkey] PRIMARY KEY CLUSTERED ([appellantCaseInvalidReasonId],[appellantCaseId])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseIncompleteReasonText] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    [appellantCaseIncompleteReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseIncompleteReasonText_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseInvalidReasonText] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    [appellantCaseInvalidReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseInvalidReasonText_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[KnowledgeOfOtherLandowners] (
    [id] INT NOT NULL IDENTITY(1,1),
    [key] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [KnowledgeOfOtherLandowners_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [KnowledgeOfOtherLandowners_key_key] UNIQUE NONCLUSTERED ([key]),
    CONSTRAINT [KnowledgeOfOtherLandowners_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaire] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [lpaQuestionnaireValidationOutcomeId] INT,
    [lpaqCreatedDate] DATETIME2 NOT NULL CONSTRAINT [LPAQuestionnaire_lpaqCreatedDate_df] DEFAULT CURRENT_TIMESTAMP,
    [lpaQuestionnaireSubmittedDate] DATETIME2,
    [lpaStatement] NVARCHAR(1000),
    [newConditionDetails] NVARCHAR(max),
    [siteAccessDetails] NVARCHAR(1000),
    [siteSafetyDetails] NVARCHAR(1000),
    [isCorrectAppealType] BIT,
    [inConservationArea] BIT,
    [lpaCostsAppliedFor] BIT,
    [isGreenBelt] BIT,
    [affectsScheduledMonument] BIT,
    [isAonbNationalLandscape] BIT,
    [isGypsyOrTravellerSite] BIT,
    [isPublicRightOfWay] BIT,
    [eiaEnvironmentalImpactSchedule] NVARCHAR(1000),
    [eiaDevelopmentDescription] NVARCHAR(1000),
    [eiaSensitiveAreaDetails] NVARCHAR(1000),
    [eiaColumnTwoThreshold] BIT,
    [eiaScreeningOpinion] BIT,
    [eiaRequiresEnvironmentalStatement] BIT,
    [eiaCompletedEnvironmentalStatement] BIT,
    [eiaScopingOpinion] BIT,
    [consultedBodiesDetails] NVARCHAR(1000),
    [hasProtectedSpecies] BIT,
    [hasStatutoryConsultees] BIT,
    [hasInfrastructureLevy] BIT,
    [hasTreePreservationOrder] BIT,
    [hasConsultationResponses] BIT,
    [hasEmergingPlan] BIT,
    [hasSupplementaryPlanningDocs] BIT,
    [isInfrastructureLevyFormallyAdopted] BIT,
    [infrastructureLevyAdoptedDate] DATETIME2,
    [infrastructureLevyExpectedDate] DATETIME2,
    [lpaProcedurePreference] NVARCHAR(1000),
    [lpaProcedurePreferenceDetails] NVARCHAR(1000),
    [lpaProcedurePreferenceDuration] INT,
    [lpaFinalCommentDetails] NVARCHAR(1000),
    [lpaAddedWitnesses] BIT,
    [siteWithinSSSI] BIT,
    [reasonForNeighbourVisits] NVARCHAR(1000),
    [importantInformation] NVARCHAR(1000),
    [redeterminedIndicator] NVARCHAR(1000),
    [dateCostsReportDespatched] DATETIME2,
    [dateNotRecoveredOrDerecovered] DATETIME2,
    [dateRecovered] DATETIME2,
    [originalCaseDecisionDate] DATETIME2,
    [targetDate] DATETIME2,
    [siteNoticesSentDate] DATETIME2,
    [designatedSiteNameCustom] NVARCHAR(1000),
    [historicEnglandConsultation] BIT,
    [preserveGrantLoan] BIT,
    [isSiteInAreaOfSpecialControlAdverts] BIT,
    [wasApplicationRefusedDueToHighwayOrTraffic] BIT,
    [didAppellantSubmitCompletePhotosAndPlans] BIT,
    CONSTRAINT [LPAQuestionnaire_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAQuestionnaire_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireValidationOutcome] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [LPAQuestionnaireValidationOutcome_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAQuestionnaireValidationOutcome_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireIncompleteReason] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [hasText] BIT NOT NULL CONSTRAINT [LPAQuestionnaireIncompleteReason_hasText_df] DEFAULT 0,
    CONSTRAINT [LPAQuestionnaireIncompleteReason_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAQuestionnaireIncompleteReason_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireIncompleteReasonsSelected] (
    [lpaQuestionnaireIncompleteReasonId] INT NOT NULL,
    [lpaQuestionnaireId] INT NOT NULL,
    CONSTRAINT [LPAQuestionnaireIncompleteReasonsSelected_pkey] PRIMARY KEY CLUSTERED ([lpaQuestionnaireIncompleteReasonId],[lpaQuestionnaireId])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireIncompleteReasonText] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    [lpaQuestionnaireIncompleteReasonId] INT NOT NULL,
    [lpaQuestionnaireId] INT NOT NULL,
    CONSTRAINT [LPAQuestionnaireIncompleteReasonText_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ListedBuildingSelected] (
    [id] INT NOT NULL IDENTITY(1,1),
    [lpaQuestionnaireId] INT,
    [listEntry] NVARCHAR(1000) NOT NULL,
    [affectsListedBuilding] BIT NOT NULL CONSTRAINT [ListedBuildingSelected_affectsListedBuilding_df] DEFAULT 1,
    CONSTRAINT [ListedBuildingSelected_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LPANotificationMethods] (
    [id] INT NOT NULL IDENTITY(1,1),
    [key] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [LPANotificationMethods_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPANotificationMethods_key_key] UNIQUE NONCLUSTERED ([key]),
    CONSTRAINT [LPANotificationMethods_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[LPANotificationMethodsSelected] (
    [notificationMethodId] INT NOT NULL,
    [lpaQuestionnaireId] INT NOT NULL,
    CONSTRAINT [LPANotificationMethodsSelected_pkey] PRIMARY KEY CLUSTERED ([notificationMethodId],[lpaQuestionnaireId])
);

-- CreateTable
CREATE TABLE [dbo].[DesignatedSite] (
    [id] INT NOT NULL IDENTITY(1,1),
    [key] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DesignatedSite_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DesignatedSite_key_key] UNIQUE NONCLUSTERED ([key]),
    CONSTRAINT [DesignatedSite_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[DesignatedSiteSelected] (
    [designatedSiteId] INT NOT NULL,
    [lpaQuestionnaireId] INT NOT NULL,
    CONSTRAINT [DesignatedSiteSelected_pkey] PRIMARY KEY CLUSTERED ([designatedSiteId],[lpaQuestionnaireId])
);

-- CreateTable
CREATE TABLE [dbo].[SiteVisit] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [siteVisitTypeId] INT,
    [visitDate] DATETIME2,
    [visitStartTime] DATETIME2,
    [visitEndTime] DATETIME2,
    [whoMissedSiteVisit] NVARCHAR(1000),
    CONSTRAINT [SiteVisit_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SiteVisit_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[SiteVisitType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [key] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SiteVisitType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SiteVisitType_key_key] UNIQUE NONCLUSTERED ([key]),
    CONSTRAINT [SiteVisitType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[InspectorDecision] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [outcome] NVARCHAR(1000) NOT NULL,
    [decisionLetterGuid] NVARCHAR(1000),
    [invalidDecisionReason] NVARCHAR(1000),
    [caseDecisionOutcomeDate] DATETIME2,
    CONSTRAINT [InspectorDecision_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [InspectorDecision_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[Folder] (
    [id] INT NOT NULL IDENTITY(1,1),
    [path] NVARCHAR(1000) NOT NULL,
    [caseId] INT NOT NULL,
    CONSTRAINT [Folder_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Folder_caseId_path_key] UNIQUE NONCLUSTERED ([caseId],[path])
);

-- CreateTable
CREATE TABLE [dbo].[Document] (
    [guid] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [caseId] INT NOT NULL,
    [folderId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Document_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [isDeleted] BIT NOT NULL CONSTRAINT [Document_isDeleted_df] DEFAULT 0,
    [latestVersionId] INT,
    CONSTRAINT [Document_pkey] PRIMARY KEY CLUSTERED ([guid]),
    CONSTRAINT [Document_name_folderId_key] UNIQUE NONCLUSTERED ([name],[folderId]),
    CONSTRAINT [Document_guid_latestVersionId_key] UNIQUE NONCLUSTERED ([guid],[latestVersionId])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentVersion] (
    [documentGuid] NVARCHAR(1000) NOT NULL,
    [version] INT NOT NULL,
    [lastModified] DATETIME2,
    [documentType] NVARCHAR(1000),
    [published] BIT NOT NULL CONSTRAINT [DocumentVersion_published_df] DEFAULT 0,
    [draft] BIT NOT NULL CONSTRAINT [DocumentVersion_draft_df] DEFAULT 1,
    [sourceSystem] NVARCHAR(1000) NOT NULL CONSTRAINT [DocumentVersion_sourceSystem_df] DEFAULT 'back-office-appeals',
    [virusCheckStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [DocumentVersion_virusCheckStatus_df] DEFAULT 'not_scanned',
    [origin] NVARCHAR(1000),
    [originalFilename] NVARCHAR(1000),
    [fileName] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [owner] NVARCHAR(1000),
    [author] NVARCHAR(1000),
    [mime] NVARCHAR(1000),
    [horizonDataID] NVARCHAR(1000),
    [fileMD5] NVARCHAR(1000),
    [size] INT,
    [stage] NVARCHAR(1000),
    [blobStorageContainer] NVARCHAR(1000),
    [blobStoragePath] NVARCHAR(1000),
    [documentURI] NVARCHAR(1000),
    [dateCreated] DATETIME2 CONSTRAINT [DocumentVersion_dateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    [datePublished] DATETIME2,
    [dateReceived] DATETIME2,
    [isDeleted] BIT NOT NULL CONSTRAINT [DocumentVersion_isDeleted_df] DEFAULT 0,
    [isLateEntry] BIT,
    [redactionStatusId] INT,
    CONSTRAINT [DocumentVersion_pkey] PRIMARY KEY CLUSTERED ([documentGuid],[version])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentVersionAvScan] (
    [documentGuid] NVARCHAR(1000) NOT NULL,
    [version] INT NOT NULL,
    [avScanSuccess] BIT NOT NULL,
    [avScanDate] DATETIME2 NOT NULL CONSTRAINT [DocumentVersionAvScan_avScanDate_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [DocumentVersionAvScan_pkey] PRIMARY KEY CLUSTERED ([documentGuid],[version])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentVersionAudit] (
    [id] INT NOT NULL IDENTITY(1,1),
    [documentGuid] NVARCHAR(1000) NOT NULL,
    [version] INT NOT NULL,
    [auditTrailId] INT NOT NULL,
    [action] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DocumentVersionAudit_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DocumentVersionAudit_auditTrailId_key] UNIQUE NONCLUSTERED ([auditTrailId])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentRedactionStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [key] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DocumentRedactionStatus_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DocumentRedactionStatus_key_key] UNIQUE NONCLUSTERED ([key]),
    CONSTRAINT [DocumentRedactionStatus_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AuditTrail] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [userId] INT NOT NULL,
    [loggedAt] DATETIME2 NOT NULL,
    [details] NVARCHAR(max) NOT NULL,
    CONSTRAINT [AuditTrail_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Representation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [representationType] NVARCHAR(1000) NOT NULL,
    [dateCreated] DATETIME2 NOT NULL CONSTRAINT [Representation_dateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    [dateLastUpdated] DATETIME2 NOT NULL CONSTRAINT [Representation_dateLastUpdated_df] DEFAULT CURRENT_TIMESTAMP,
    [originalRepresentation] NVARCHAR(max),
    [redactedRepresentation] NVARCHAR(max),
    [representedId] INT,
    [representativeId] INT,
    [lpaCode] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Representation_status_df] DEFAULT 'awaiting_review',
    [reviewer] NVARCHAR(1000),
    [notes] NVARCHAR(1000),
    [siteVisitRequested] BIT NOT NULL CONSTRAINT [Representation_siteVisitRequested_df] DEFAULT 0,
    [source] NVARCHAR(1000) NOT NULL CONSTRAINT [Representation_source_df] DEFAULT 'citizen',
    CONSTRAINT [Representation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RepresentationAttachment] (
    [documentGuid] NVARCHAR(1000) NOT NULL,
    [version] INT NOT NULL,
    [representationId] INT NOT NULL,
    CONSTRAINT [RepresentationAttachment_pkey] PRIMARY KEY CLUSTERED ([documentGuid],[version])
);

-- CreateTable
CREATE TABLE [dbo].[RepresentationRejectionReason] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [hasText] BIT NOT NULL CONSTRAINT [RepresentationRejectionReason_hasText_df] DEFAULT 0,
    [representationType] NVARCHAR(1000) NOT NULL CONSTRAINT [RepresentationRejectionReason_representationType_df] DEFAULT 'comment',
    CONSTRAINT [RepresentationRejectionReason_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RepresentationRejectionReason_name_representationType_key] UNIQUE NONCLUSTERED ([name],[representationType])
);

-- CreateTable
CREATE TABLE [dbo].[RepresentationRejectionReasonsSelected] (
    [representationRejectionReasonId] INT NOT NULL,
    [representationId] INT NOT NULL,
    CONSTRAINT [RepresentationRejectionReasonsSelected_pkey] PRIMARY KEY CLUSTERED ([representationRejectionReasonId],[representationId])
);

-- CreateTable
CREATE TABLE [dbo].[RepresentationRejectionReasonText] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    [representationRejectionReasonId] INT NOT NULL,
    [representationId] INT NOT NULL,
    CONSTRAINT [RepresentationRejectionReasonText_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CaseNote] (
    [id] INT NOT NULL IDENTITY(1,1),
    [caseId] INT NOT NULL,
    [comment] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CaseNote_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] INT NOT NULL,
    [archived] BIT NOT NULL CONSTRAINT [CaseNote_archived_df] DEFAULT 0,
    CONSTRAINT [CaseNote_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Hearing] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [hearingStartTime] DATETIME2 NOT NULL,
    [hearingEndTime] DATETIME2,
    [addressId] INT,
    CONSTRAINT [Hearing_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Hearing_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[Inquiry] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [inquiryStartTime] DATETIME2 NOT NULL,
    [inquiryEndTime] DATETIME2,
    [addressId] INT,
    [estimatedDays] INT,
    CONSTRAINT [Inquiry_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Inquiry_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[ListedBuilding] (
    [reference] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [grade] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ListedBuilding_pkey] PRIMARY KEY CLUSTERED ([reference])
);

-- CreateTable
CREATE TABLE [dbo].[AppealNotification] (
    [id] INT NOT NULL IDENTITY(1,1),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [template] NVARCHAR(1000) NOT NULL,
    [subject] NVARCHAR(1000) NOT NULL,
    [renderedSubject] NVARCHAR(1000),
    [recipient] NVARCHAR(1000) NOT NULL,
    [message] NVARCHAR(max) NOT NULL,
    [renderedMessage] NVARCHAR(max),
    [sender] NVARCHAR(1000),
    [success] BIT NOT NULL CONSTRAINT [AppealNotification_success_df] DEFAULT 1,
    [dateCreated] DATETIME2 NOT NULL CONSTRAINT [AppealNotification_dateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [AppealNotification_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[HearingEstimate] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [preparationTime] DECIMAL(32,16),
    [sittingTime] DECIMAL(32,16),
    [reportingTime] DECIMAL(32,16),
    CONSTRAINT [HearingEstimate_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [HearingEstimate_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[InquiryEstimate] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [preparationTime] DECIMAL(32,16),
    [sittingTime] DECIMAL(32,16),
    [reportingTime] DECIMAL(32,16),
    CONSTRAINT [InquiryEstimate_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [InquiryEstimate_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[Team] (
    [id] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    CONSTRAINT [Team_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Team_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[PersonalList] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [linkType] NVARCHAR(1000),
    [leadAppealId] INT,
    [dueDate] DATETIME2,
    CONSTRAINT [PersonalList_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PersonalList_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseAdvertDetails] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appellantCaseId] INT NOT NULL,
    [advertTypeId] INT,
    [advertInPosition] BIT NOT NULL,
    [highwayLand] BIT NOT NULL,
    CONSTRAINT [AppellantCaseAdvertDetails_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AdvertType] (
    [id] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AdvertType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AdvertType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[PADSUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [sapId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [PADSUser_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PADSUser_sapId_key] UNIQUE NONCLUSTERED ([sapId])
);

-- CreateTable
CREATE TABLE [dbo].[AppealRule6Party] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [serviceUserId] INT NOT NULL,
    CONSTRAINT [AppealRule6Party_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ground] (
    [id] INT NOT NULL IDENTITY(1,1),
    [groundRef] NVARCHAR(1000) NOT NULL,
    [groundDescription] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Ground_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ground_groundRef_key] UNIQUE NONCLUSTERED ([groundRef])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Appeal_addressId_idx] ON [dbo].[Appeal]([addressId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Appeal_appealTypeId_idx] ON [dbo].[Appeal]([appealTypeId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Appeal_procedureTypeId_idx] ON [dbo].[Appeal]([procedureTypeId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Appeal_lpaId_idx] ON [dbo].[Appeal]([lpaId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Appeal_caseOfficerUserId_idx] ON [dbo].[Appeal]([caseOfficerUserId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Appeal_inspectorUserId_idx] ON [dbo].[Appeal]([inspectorUserId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Appeal_applicationReference_idx] ON [dbo].[Appeal]([applicationReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealRelationship_parentId_idx] ON [dbo].[AppealRelationship]([parentId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealRelationship_childId_idx] ON [dbo].[AppealRelationship]([childId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealRelationship_type_parentRef_childRef_idx] ON [dbo].[AppealRelationship]([type], [parentRef], [childRef]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealStatus_appealId_idx] ON [dbo].[AppealStatus]([appealId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealStatus_valid_appealId_idx] ON [dbo].[AppealStatus]([valid], [appealId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealSpecialism_appealId_idx] ON [dbo].[AppealSpecialism]([appealId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealSpecialism_specialismId_idx] ON [dbo].[AppealSpecialism]([specialismId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppellantCaseIncompleteReasonText_appellantCaseId_idx] ON [dbo].[AppellantCaseIncompleteReasonText]([appellantCaseId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppellantCaseIncompleteReasonText_appellantCaseIncompleteReasonId_idx] ON [dbo].[AppellantCaseIncompleteReasonText]([appellantCaseIncompleteReasonId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppellantCaseInvalidReasonText_appellantCaseId_idx] ON [dbo].[AppellantCaseInvalidReasonText]([appellantCaseId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppellantCaseInvalidReasonText_appellantCaseInvalidReasonId_idx] ON [dbo].[AppellantCaseInvalidReasonText]([appellantCaseInvalidReasonId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [LPAQuestionnaire_isGreenBelt_idx] ON [dbo].[LPAQuestionnaire]([isGreenBelt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Folder_path_idx] ON [dbo].[Folder]([path]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Document_caseId_folderId_idx] ON [dbo].[Document]([caseId], [folderId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Document_folderId_idx] ON [dbo].[Document]([folderId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [documentGuid] ON [dbo].[DocumentVersion]([documentGuid]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [DocumentVersion_documentURI_idx] ON [dbo].[DocumentVersion]([documentURI]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [DocumentVersion_documentType_idx] ON [dbo].[DocumentVersion]([documentType]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [DocumentVersion_stage_idx] ON [dbo].[DocumentVersion]([stage]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [documentGuid] ON [dbo].[DocumentVersionAvScan]([documentGuid]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AuditTrail_appealId_idx] ON [dbo].[AuditTrail]([appealId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Representation_appealId_idx] ON [dbo].[Representation]([appealId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [RepresentationAttachment_representationId_idx] ON [dbo].[RepresentationAttachment]([representationId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CaseNote_caseId_idx] ON [dbo].[CaseNote]([caseId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealNotification_caseReference_idx] ON [dbo].[AppealNotification]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealNotification_template_idx] ON [dbo].[AppealNotification]([template]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealNotification_dateCreated_idx] ON [dbo].[AppealNotification]([dateCreated] DESC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [PersonalList_dueDate_leadAppealId_linkType_appealId_idx] ON [dbo].[PersonalList]([dueDate], [leadAppealId], [linkType] DESC, [appealId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppellantCaseAdvertDetails_advertTypeId_idx] ON [dbo].[AppellantCaseAdvertDetails]([advertTypeId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppellantCaseAdvertDetails_appellantCaseId_idx] ON [dbo].[AppellantCaseAdvertDetails]([appellantCaseId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealRule6Party_appealId_idx] ON [dbo].[AppealRule6Party]([appealId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealRule6Party_serviceUserId_idx] ON [dbo].[AppealRule6Party]([serviceUserId]);

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_appealTypeId_fkey] FOREIGN KEY ([appealTypeId]) REFERENCES [dbo].[AppealType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_procedureTypeId_fkey] FOREIGN KEY ([procedureTypeId]) REFERENCES [dbo].[ProcedureType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_lpaId_fkey] FOREIGN KEY ([lpaId]) REFERENCES [dbo].[LPA]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_appellantId_fkey] FOREIGN KEY ([appellantId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_caseOfficerUserId_fkey] FOREIGN KEY ([caseOfficerUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_inspectorUserId_fkey] FOREIGN KEY ([inspectorUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_padsInspectorUserId_fkey] FOREIGN KEY ([padsInspectorUserId]) REFERENCES [dbo].[PADSUser]([sapId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_assignedTeamId_fkey] FOREIGN KEY ([assignedTeamId]) REFERENCES [dbo].[Team]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppealRelationship] ADD CONSTRAINT [AppealRelationship_parentId_fkey] FOREIGN KEY ([parentId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppealRelationship] ADD CONSTRAINT [AppealRelationship_childId_fkey] FOREIGN KEY ([childId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppealTimetable] ADD CONSTRAINT [AppealTimetable_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealStatus] ADD CONSTRAINT [AppealStatus_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealAllocation] ADD CONSTRAINT [AppealAllocation_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealSpecialism] ADD CONSTRAINT [AppealSpecialism_specialismId_fkey] FOREIGN KEY ([specialismId]) REFERENCES [dbo].[Specialism]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealSpecialism] ADD CONSTRAINT [AppealSpecialism_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPA] ADD CONSTRAINT [LPA_teamId_fkey] FOREIGN KEY ([teamId]) REFERENCES [dbo].[Team]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceUser] ADD CONSTRAINT [ServiceUser_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[NeighbouringSite] ADD CONSTRAINT [NeighbouringSite_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[NeighbouringSite] ADD CONSTRAINT [NeighbouringSite_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_appellantCaseValidationOutcomeId_fkey] FOREIGN KEY ([appellantCaseValidationOutcomeId]) REFERENCES [dbo].[AppellantCaseValidationOutcome]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_knowsOtherOwnersId_fkey] FOREIGN KEY ([knowsOtherOwnersId]) REFERENCES [dbo].[KnowledgeOfOtherLandowners]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_knowsAllOwnersId_fkey] FOREIGN KEY ([knowsAllOwnersId]) REFERENCES [dbo].[KnowledgeOfOtherLandowners]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_contactAddressId_fkey] FOREIGN KEY ([contactAddressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppealGround] ADD CONSTRAINT [AppealGround_groundId_fkey] FOREIGN KEY ([groundId]) REFERENCES [dbo].[Ground]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealGround] ADD CONSTRAINT [AppealGround_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseIncompleteReasonsSelected] ADD CONSTRAINT [AppellantCaseIncompleteReasonsSelected_appellantCaseIncompleteReasonId_fkey] FOREIGN KEY ([appellantCaseIncompleteReasonId]) REFERENCES [dbo].[AppellantCaseIncompleteReason]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseIncompleteReasonsSelected] ADD CONSTRAINT [AppellantCaseIncompleteReasonsSelected_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseId]) REFERENCES [dbo].[AppellantCase]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseInvalidReasonsSelected] ADD CONSTRAINT [AppellantCaseInvalidReasonsSelected_appellantCaseInvalidReasonId_fkey] FOREIGN KEY ([appellantCaseInvalidReasonId]) REFERENCES [dbo].[AppellantCaseInvalidReason]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseInvalidReasonsSelected] ADD CONSTRAINT [AppellantCaseInvalidReasonsSelected_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseId]) REFERENCES [dbo].[AppellantCase]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseIncompleteReasonText] ADD CONSTRAINT [AppellantCaseIncompleteReasonText_appellantCaseIncompleteReasonId_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseIncompleteReasonId], [appellantCaseId]) REFERENCES [dbo].[AppellantCaseIncompleteReasonsSelected]([appellantCaseIncompleteReasonId],[appellantCaseId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseInvalidReasonText] ADD CONSTRAINT [AppellantCaseInvalidReasonText_appellantCaseInvalidReasonId_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseInvalidReasonId], [appellantCaseId]) REFERENCES [dbo].[AppellantCaseInvalidReasonsSelected]([appellantCaseInvalidReasonId],[appellantCaseId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_lpaQuestionnaireValidationOutcomeId_fkey] FOREIGN KEY ([lpaQuestionnaireValidationOutcomeId]) REFERENCES [dbo].[LPAQuestionnaireValidationOutcome]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireIncompleteReasonsSelected] ADD CONSTRAINT [LPAQuestionnaireIncompleteReasonsSelected_lpaQuestionnaireIncompleteReasonId_fkey] FOREIGN KEY ([lpaQuestionnaireIncompleteReasonId]) REFERENCES [dbo].[LPAQuestionnaireIncompleteReason]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireIncompleteReasonsSelected] ADD CONSTRAINT [LPAQuestionnaireIncompleteReasonsSelected_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaire]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireIncompleteReasonText] ADD CONSTRAINT [LPAQuestionnaireIncompleteReasonText_lpaQuestionnaireIncompleteReasonId_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireIncompleteReasonId], [lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaireIncompleteReasonsSelected]([lpaQuestionnaireIncompleteReasonId],[lpaQuestionnaireId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ListedBuildingSelected] ADD CONSTRAINT [ListedBuildingSelected_listEntry_fkey] FOREIGN KEY ([listEntry]) REFERENCES [dbo].[ListedBuilding]([reference]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ListedBuildingSelected] ADD CONSTRAINT [ListedBuildingSelected_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaire]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPANotificationMethodsSelected] ADD CONSTRAINT [LPANotificationMethodsSelected_notificationMethodId_fkey] FOREIGN KEY ([notificationMethodId]) REFERENCES [dbo].[LPANotificationMethods]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPANotificationMethodsSelected] ADD CONSTRAINT [LPANotificationMethodsSelected_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaire]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DesignatedSiteSelected] ADD CONSTRAINT [DesignatedSiteSelected_designatedSiteId_fkey] FOREIGN KEY ([designatedSiteId]) REFERENCES [dbo].[DesignatedSite]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DesignatedSiteSelected] ADD CONSTRAINT [DesignatedSiteSelected_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaire]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SiteVisit] ADD CONSTRAINT [SiteVisit_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SiteVisit] ADD CONSTRAINT [SiteVisit_siteVisitTypeId_fkey] FOREIGN KEY ([siteVisitTypeId]) REFERENCES [dbo].[SiteVisitType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InspectorDecision] ADD CONSTRAINT [InspectorDecision_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_folderId_fkey] FOREIGN KEY ([folderId]) REFERENCES [dbo].[Folder]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_guid_latestVersionId_fkey] FOREIGN KEY ([guid], [latestVersionId]) REFERENCES [dbo].[DocumentVersion]([documentGuid],[version]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_redactionStatusId_fkey] FOREIGN KEY ([redactionStatusId]) REFERENCES [dbo].[DocumentRedactionStatus]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_documentGuid_fkey] FOREIGN KEY ([documentGuid]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersionAudit] ADD CONSTRAINT [DocumentVersionAudit_documentGuid_fkey] FOREIGN KEY ([documentGuid]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersionAudit] ADD CONSTRAINT [DocumentVersionAudit_auditTrailId_fkey] FOREIGN KEY ([auditTrailId]) REFERENCES [dbo].[AuditTrail]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditTrail] ADD CONSTRAINT [AuditTrail_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AuditTrail] ADD CONSTRAINT [AuditTrail_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Representation] ADD CONSTRAINT [Representation_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Representation] ADD CONSTRAINT [Representation_representedId_fkey] FOREIGN KEY ([representedId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Representation] ADD CONSTRAINT [Representation_representativeId_fkey] FOREIGN KEY ([representativeId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Representation] ADD CONSTRAINT [Representation_lpaCode_fkey] FOREIGN KEY ([lpaCode]) REFERENCES [dbo].[LPA]([lpaCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationAttachment] ADD CONSTRAINT [RepresentationAttachment_documentGuid_version_fkey] FOREIGN KEY ([documentGuid], [version]) REFERENCES [dbo].[DocumentVersion]([documentGuid],[version]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationAttachment] ADD CONSTRAINT [RepresentationAttachment_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationRejectionReasonsSelected] ADD CONSTRAINT [RepresentationRejectionReasonsSelected_representationRejectionReasonId_fkey] FOREIGN KEY ([representationRejectionReasonId]) REFERENCES [dbo].[RepresentationRejectionReason]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationRejectionReasonsSelected] ADD CONSTRAINT [RepresentationRejectionReasonsSelected_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationRejectionReasonText] ADD CONSTRAINT [RepresentationRejectionReasonText_representationRejectionReasonId_representationId_fkey] FOREIGN KEY ([representationRejectionReasonId], [representationId]) REFERENCES [dbo].[RepresentationRejectionReasonsSelected]([representationRejectionReasonId],[representationId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CaseNote] ADD CONSTRAINT [CaseNote_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CaseNote] ADD CONSTRAINT [CaseNote_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Hearing] ADD CONSTRAINT [Hearing_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Hearing] ADD CONSTRAINT [Hearing_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Inquiry] ADD CONSTRAINT [Inquiry_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Inquiry] ADD CONSTRAINT [Inquiry_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppealNotification] ADD CONSTRAINT [AppealNotification_caseReference_fkey] FOREIGN KEY ([caseReference]) REFERENCES [dbo].[Appeal]([reference]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HearingEstimate] ADD CONSTRAINT [HearingEstimate_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InquiryEstimate] ADD CONSTRAINT [InquiryEstimate_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PersonalList] ADD CONSTRAINT [PersonalList_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseAdvertDetails] ADD CONSTRAINT [AppellantCaseAdvertDetails_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseId]) REFERENCES [dbo].[AppellantCase]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseAdvertDetails] ADD CONSTRAINT [AppellantCaseAdvertDetails_advertTypeId_fkey] FOREIGN KEY ([advertTypeId]) REFERENCES [dbo].[AdvertType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealRule6Party] ADD CONSTRAINT [AppealRule6Party_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppealRule6Party] ADD CONSTRAINT [AppealRule6Party_serviceUserId_fkey] FOREIGN KEY ([serviceUserId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
