# MicaLibrary

The MicaLibrary module exposes a searchable, filterable library of educational and wellbeing resources for users.

## Purpose

This module serves curated resources such as:

- articles
- audio clips
- videos

It supports browsing by kind, category, search term, and featured status, and it caches results to keep reads fast.

## Data model

The underlying Prisma model is `Resource`.

| Field | Type | Description |
| --- | --- | --- |
| `slug` | `String` | Unique, URL-friendly resource identifier |
| `title` | `String` | Resource title |
| `kind` | `ResourceKind` | One of `article`, `audio`, or `video` |
| `durationMin` | `Int` | Estimated reading/listening duration in minutes |
| `category` | `String` | Category label such as `health`, `work`, or `rest` |
| `excerpt` | `String` | Short summary shown in list views |
| `body` | `String?` | Full content, optional |
| `featured` | `Boolean` | Marks a highlighted resource |

## Query parameters

The `QueryResourceDto` supports the following filters:

- `kind`: resource kind (`article`, `audio`, `video`)
- `category`: exact category match
- `search`: case-insensitive search across title and excerpt
- `featured`: boolean filter
- `page`: page number, default `1`
- `limit`: page size, default `10`, max `50`

## API endpoints

### GET /library

Returns a paginated list of resources that match the given filters.

#### Example request

```http
GET /library?kind=article&category=health&featured=true&page=1&limit=10
```

#### Example response

```json
{
  "success": true,
  "message": "Resources retrieved successfully",
  "data": {
    "items": [
      {
        "slug": "sleep-better",
        "title": "How to sleep better at night",
        "kind": "article",
        "durationMin": 6,
        "category": "health",
        "excerpt": "Simple habits that help your body settle before sleep.",
        "body": "Full article content...",
        "featured": true
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

## Service behavior

The library service has two main fetch methods:

### `findAll(query)`

- builds a cache key based on the query payload
- checks the cache for a matching result
- queries `ResourceRepository.findFiltered(query)` when the cache misses
- caches the returned data for 5 minutes

### `findOne(slug)`

- checks cache by resource slug
- loads the resource by ID/slug via `findBySlug`
- throws `NotFoundException` if the resource is missing
- caches the resource for 5 minutes

## Repository behavior

`ResourceRepository.findFiltered(query)` applies the filters below:

- `kind`
- `category`
- `featured`
- case-insensitive full-text search on `title` and `excerpt`

The repository then returns:

- matching rows
- total count
- current page
- page size
- total pages

## Cache strategy

The module uses NestJS cache manager with a 5-minute TTL for both the list and single-item fetches.

This keeps repeated queries fast for common resource listings and detail pages.

## Implementation notes

- The module is registered in `LibraryModule`.
- The controller and service live under `src/modules/mica-library/library`.
- The repository is `ResourceRepository`.
- Cache module configuration is included in the module definition.

## Current status / caveats

- The `LibraryController` currently exposes `GET /library`.
- A `findOne(slug)` service method exists, but no controller route is currently wired to it.
- The module is built for list browsing and filtering, and can be extended to include a dedicated detail endpoint when needed.
