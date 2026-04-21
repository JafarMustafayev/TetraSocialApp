global using Microsoft.EntityFrameworkCore;
global using Microsoft.Extensions.Configuration;
global using Microsoft.Extensions.DependencyInjection;
global using Hukaa.Persistence.Context;
global using Hukaa.Domain.Entities.Identities;
global using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
global using Hukaa.Application.Abstractions.Common;
global using Hukaa.Application.Options.Database;
global using Microsoft.AspNetCore.Identity;
global using Microsoft.EntityFrameworkCore.Metadata.Builders;
global using Hukaa.Persistence.Configurations;
global using Hukaa.Domain.Consts;
global using System.Linq.Expressions;
global using Hukaa.Application.Abstractions.Repositories.Base;
global using Hukaa.Domain.Entities.Common;
global using Hukaa.Application.Abstractions.Repositories.UnitOfWork;
global using Hukaa.Domain.Entities.Auth;
global using Hukaa.Application.Abstractions.Repositories.RefreshTokenRepos;
global using Hukaa.Persistence.Repositories.Base;
global using Hukaa.Persistence.Repositories.RefreshTokenRepos;
global using Hukaa.Persistence.Repositories.UnitOfWork;
global using Hukaa.Application.Abstractions.Repositories.AuthSessionRepos;
global using Hukaa.Persistence.Repositories.AuthSessionRepos;
global using Hukaa.Application.Abstractions.Repositories.VerificationTokenRepos;
global using Hukaa.Persistence.Repositories.VerificationTokenRepos;

// ---------------
global using IdentityOptions = Hukaa.Application.Options.Identity.IdentityOptions;
global using TokenOptions = Hukaa.Application.Options.Token.TokenOptions;