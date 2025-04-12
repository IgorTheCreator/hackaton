import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

// Перечисления для типа проекта
const ProjectTypeSchema = z
  .enum([
    'TreePlanting',
    'WaterCleanup',
    'RenewableEnergy',
    'WasteRecycling',
    'Biodiversity',
    'Other',
  ])
  .describe('Тип проекта')

// Перечисления для основного экологического эффекта
const MainImpactTypeSchema = z
  .enum(['CO2Reduction', 'TreesPlanted', 'WaterCleaned', 'WasteRecycled', 'LandRestored', 'Other'])
  .describe('Тип основного экологического эффекта')

// Схема для объекта mainImpact
const MainImpactSchema = z
  .object({
    type: MainImpactTypeSchema,
    value: z.number().min(0).describe('Количественное значение эффекта'),
  })
  .strict()
  .describe('Основной экологический эффект проекта')

// Схема для environmental
const EnvironmentalSchema = z
  .object({
    mainImpact: MainImpactSchema,
    renewableEnergyUsed: z.boolean().optional().describe('Использование возобновляемой энергии'),
    waterMinimized: z.boolean().optional().describe('Минимизация потребления воды'),
    biodiversityImpact: z.string().optional().describe('Влияние на биоразнообразие'),
    landRestored: z.number().min(0).optional().describe('Площадь восстановленной земли (га)'),
    wasteRecycled: z.number().min(0).optional().describe('Объём переработанных отходов (тонн)'),
    waterSaved: z.number().min(0).optional().describe('Объём сохранённой воды (м³)'),
    co2Reduction: z.number().min(0).optional().describe('Снижение выбросов CO2 (тонн)'),
    treesPlanted: z.number().int().min(0).optional().describe('Количество посаженных деревьев'),
  })
  .strict()
  .describe('Экологические показатели проекта')

// Схема для social
const SocialSchema = z
  .object({
    jobsCreated: z
      .object({
        enabled: z.boolean().describe('Создаются ли рабочие места'),
        count: z.number().int().min(0).optional().describe('Количество созданных рабочих мест'),
      })
      .optional()
      .describe('Создание рабочих мест'),
    communityEngagement: z
      .object({
        enabled: z.boolean().describe('Вовлечение местных жителей'),
        count: z.number().int().min(0).optional().describe('Количество вовлечённых жителей'),
      })
      .optional()
      .describe('Вовлечение сообщества'),
    resourceAccess: z
      .object({
        enabled: z.boolean().describe('Улучшение доступа к ресурсам'),
        description: z.string().optional().describe('Описание улучшения доступа'),
      })
      .optional()
      .describe('Доступ к ресурсам (вода, энергия, образование)'),
    educationPrograms: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe('Количество участников образовательных программ'),
  })
  .strict()
  .describe('Социальные показатели проекта')

// Схема для governance
const GovernanceSchema = z
  .object({
    financialTransparency: z.boolean().optional().describe('Финансовая прозрачность'),
    regularReports: z.boolean().optional().describe('Регулярные отчёты о прогрессе'),
    riskManagement: z.boolean().optional().describe('Управление рисками'),
    stakeholderEngagement: z.boolean().optional().describe('Вовлечение стейкхолдеров'),
  })
  .strict()
  .describe('Показатели управления проектом')

// Основная схема для всего DTO
const CreateProjectSchema = z
  .object({
    title: z.string().min(1).describe('Название проекта'),
    purpose: z.string().min(20).describe('Цель проекта'),
    endDate: z.string().datetime().describe('Дата окончания проекта'),
    goalFunding: z.number().int().min(500),
    description: z.string().describe('Описание проекта'),
    type: ProjectTypeSchema,
    location: z.string().min(1).describe('Местоположение проекта'),
    startDate: z.string().datetime().describe('Дата начала проекта'),
    shortDescription: z.string().min(10).max(200),
    environmental: EnvironmentalSchema,
    social: SocialSchema,
    governance: GovernanceSchema,
  })
  .strict()
  .describe('Данные для создания экологического проекта')

export class CreateProjectDto extends createZodDto(CreateProjectSchema) {}
