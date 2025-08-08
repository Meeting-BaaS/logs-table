import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import isUUID from "validator/lib/isUUID"
import {
  allPlatforms,
  allStatuses,
  allUserReportedErrorStatuses
} from "@/components/logs-table/column-helpers"
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types"
import type { FilterState } from "@/components/logs-table/types"

// Initialize dayjs UTC plugin
dayjs.extend(utc)

// Helper function to find option by searchParam
const findOptionBySearchParam = <T extends { searchParam: string; value: string }>(
  options: T[],
  searchParam: string
): string | undefined => options.find((opt) => opt.searchParam === searchParam)?.value

// Helper function to get searchParam from value
const getSearchParamFromValue = <T extends { searchParam: string; value: string }>(
  options: T[],
  value: string
): string | undefined => options.find((opt) => opt.value === value)?.searchParam

// Validate and parse date from search params
export function validateDate(dateStr: string | null): Date | null {
  if (!dateStr) return null

  const date = dayjs.utc(dateStr)
  return date.isValid() ? date.toDate() : null
}

// Validate and parse filter values from search params
export function validateFilterValues(
  platformFilters: string | null,
  statusFilters: string | null,
  userReportedErrorStatusFilters: string | null,
  userEmailFilter: string | null
): FilterState {
  const validPlatformFilters =
    platformFilters
      ?.split(",")
      .map((value) => findOptionBySearchParam(allPlatforms, value))
      .filter((value): value is string => value !== undefined) ?? []

  const validStatusFilters =
    statusFilters
      ?.split(",")
      .map((value) => findOptionBySearchParam(allStatuses, value))
      .filter((value): value is string => value !== undefined) ?? []

  const validUserReportedErrorStatusFilters =
    userReportedErrorStatusFilters
      ?.split(",")
      .map((value) => findOptionBySearchParam(allUserReportedErrorStatuses, value))
      .filter((value): value is string => value !== undefined) ?? []

  return {
    platformFilters: validPlatformFilters,
    statusFilters: validStatusFilters,
    userReportedErrorStatusFilters: validUserReportedErrorStatusFilters,
    userEmailFilter: userEmailFilter ?? ""
  }
}

// Convert filter state to URL-safe values
export function filterStateToSearchValues(filters: FilterState): {
  platformFilters: string[]
  statusFilters: string[]
  userReportedErrorStatusFilters: string[]
  userEmailFilter: string
} {
  return {
    platformFilters: filters.platformFilters
      .map((value) => getSearchParamFromValue(allPlatforms, value))
      .filter((value): value is string => value !== undefined),
    statusFilters: filters.statusFilters
      .map((value) => getSearchParamFromValue(allStatuses, value))
      .filter((value): value is string => value !== undefined),
    userReportedErrorStatusFilters: filters.userReportedErrorStatusFilters
      .map((value) => getSearchParamFromValue(allUserReportedErrorStatuses, value))
      .filter((value): value is string => value !== undefined),
    userEmailFilter: filters.userEmailFilter ?? ""
  }
}

// Validate and parse date range from search params
export function validateDateRange(startDate: string | null, endDate: string | null): DateValueType {
  const validStartDate = validateDate(startDate)
  const validEndDate = validateDate(endDate)

  // Only use dates if both are valid and in correct order
  if (validStartDate && validEndDate && dayjs(validStartDate).isBefore(validEndDate)) {
    return {
      startDate: validStartDate,
      endDate: validEndDate
    }
  }

  // If either date is invalid or dates are in wrong order, use defaults
  return {
    startDate: dayjs().subtract(14, "day").startOf("day").toDate(),
    endDate: dayjs().endOf("day").toDate()
  }
}

// Convert date to UTC string for URL
export function dateToUtcString(date: Date | null): string | null {
  if (!date) return null
  return dayjs(date).utc().format()
}

// Validate bot UUIDs from search params
export function validateBotUuids(botUuidsStr: string | null): string[] {
  if (!botUuidsStr) return []
  return botUuidsStr.split(",").filter((uuid) => isUUID(uuid, 4))
}

// Update URL search params with all filter values
export function updateSearchParams(
  params: URLSearchParams,
  dateRange: DateValueType,
  filters: FilterState,
  botUuids: string[]
): URLSearchParams {
  const newParams = new URLSearchParams(params.toString())

  // Update date range params
  const startDateUtc = dateToUtcString(dateRange?.startDate ?? null)
  const endDateUtc = dateToUtcString(dateRange?.endDate ?? null)
  if (startDateUtc && endDateUtc) {
    newParams.set("startDate", startDateUtc)
    newParams.set("endDate", endDateUtc)
  } else {
    newParams.delete("startDate")
    newParams.delete("endDate")
  }

  // Update filter params
  const searchValues = filterStateToSearchValues(filters)

  if (searchValues.platformFilters.length > 0) {
    newParams.set("platformFilters", searchValues.platformFilters.join(","))
  } else {
    newParams.delete("platformFilters")
  }

  if (searchValues.statusFilters.length > 0) {
    newParams.set("statusFilters", searchValues.statusFilters.join(","))
  } else {
    newParams.delete("statusFilters")
  }

  if (searchValues.userReportedErrorStatusFilters.length > 0) {
    newParams.set(
      "userReportedErrorStatusFilters",
      searchValues.userReportedErrorStatusFilters.join(",")
    )
  } else {
    newParams.delete("userReportedErrorStatusFilters")
  }

  if (searchValues.userEmailFilter) {
    newParams.set("userEmailFilter", searchValues.userEmailFilter)
  } else {
    newParams.delete("userEmailFilter")
  }

  // Update bot UUIDs param
  if (botUuids.length > 0) {
    newParams.set("bot_uuid", botUuids.join(","))
  } else {
    newParams.delete("bot_uuid")
  }

  return newParams
}
