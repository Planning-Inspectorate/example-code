BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Task] (
    [id] INT NOT NULL IDENTITY(1,1),
    [created] DATETIME2 NOT NULL CONSTRAINT [Task_created_df] DEFAULT CURRENT_TIMESTAMP,
    [updated] DATETIME2,
    [title] NVARCHAR(1000) NOT NULL,
    [done] BIT NOT NULL CONSTRAINT [Task_done_df] DEFAULT 0,
    [userId] INT,
    CONSTRAINT [Task_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Document] (
    [id] INT NOT NULL IDENTITY(1,1),
    [created] DATETIME2 NOT NULL CONSTRAINT [Document_created_df] DEFAULT CURRENT_TIMESTAMP,
    [updated] DATETIME2,
    [filename] NVARCHAR(1000) NOT NULL,
    [size] INT NOT NULL,
    [path] NVARCHAR(1000) NOT NULL,
    [taskId] INT NOT NULL,
    CONSTRAINT [Document_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [created] DATETIME2 NOT NULL CONSTRAINT [User_created_df] DEFAULT CURRENT_TIMESTAMP,
    [updated] DATETIME2,
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [displayName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- AddForeignKey
ALTER TABLE [dbo].[Task] ADD CONSTRAINT [Task_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_taskId_fkey] FOREIGN KEY ([taskId]) REFERENCES [dbo].[Task]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
