# MicaCheckin

The MicaCheckin module stores a user's emotional check-ins and exposes the data needed to understand mood trends over time.

## Purpose

This module supports the "Your Mica" experience by allowing users to record a mood check-in with:

- emotion (mood)
- intensity
- category
- optional note

It also provides summary data for dashboards and analytics views.

## Data model

The underlying Prisma model is `Layers`.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `String` | Unique record ID |
| `userId` | `String` | User who created the check-in |
| `emotion` | `MoodKey` | Mood value such as `calm`, `growth`, `joy`, `tender`, `rest`, `heavy` |
| `intensity` | `Int` | Intensity from 0 to 100 |
| `category` | `Category` | Category such as `work`, `relationships`, `health`, `money`, `rest`, `myself` |
| `note` | `String?` | Optional personal note up to 500 characters |
| `createdAt` | `DateTime` | Timestamp for the check-in |

## Request validation

The DTO enforces the following constraints:

- `emotion` is required and must be a valid `MoodKey`
- `intensity` is required and must be between `0` and `100`
- `category` is optional and must be a valid `Category`
- `note` is optional and limited to 500 characters

## API endpoints

### POST /mica-checkin

Creates a new emotional check-in.

#### Request body

```json
{
  "emotion": "joy",
  "intensity": 82,
  "category": "work",
  "note": "Finished a difficult sprint and felt energized."
}
```

#### Success response

```json
{
  "success": true,
  "message": "Check-in created successfully",
  "data": {
    "id": "clx123",
    "userId": "cmj8k2x4p0000v3l5g7h9q1ab",
    "emotion": "joy",
    "intensity": 82,
    "category": "work",
    "note": "Finished a difficult sprint and felt energized.",
    "createdAt": "2026-10-07T05:00:00.000Z"
  }
}
```

#### Notes

The controller currently uses a hard-coded sample `userId` in the create route instead of reading the authenticated user. This should be replaced with the real authenticated user in production.

### GET /mica-checkin/summary

Returns aggregate mood data for a user.

#### Example request

```http
GET /mica-checkin/summary?userId=cmj8k2x4p0000v3l5g7h9q1ab
```

#### Success response

```json
{
  "success": true,
  "message": "Result returned",
  "data": {
    "serviceResult": {
      "success": true,
      "message": "Aggregate retrieved successfully",
      "data": {
        "totalLayers": 12,
        "breakdown": {
          "joy": 5,
          "calm": 3,
          "rest": 2,
          "heavy": 2
        }
      }
    }
  }
}
```

## Service behavior

The service layer supports three key actions:

- creating a layer/check-in
- counting total check-ins for a user
- grouping mood totals by emotion

It also contains helper logic for recent layer retrieval and note snippets, although the recent-layers route is not currently exposed in the controller.

## Implementation notes

- The module is registered in `MicaCheckinModule`.
- The controller and service are under `src/modules/mica-checkin`.
- Prisma access is done through `LayerRepository`.
- Response format is standardized with a `buildResponse()` helper.

## Production considerations

Before moving this module into a production-ready state, the following should be addressed:

1. replace the hard-coded `userId` with JWT-authenticated identity
2. enable or expose the JWT guard
3. review whether `/mica-checkin/summary` should be scoped to the authenticated user only
4. decide whether recent layer filtering should be made available in the public API
