---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell

toc_footers:
  - <a>&nbsp;</a>
  - <a href='https://avatarmate.herokuapp.com/signup'>Sign Up for a Developer Key</a>
  - <a>&nbsp;</a>
  - <a>&nbsp;</a>
  - <a href='https://github.com/lord/slate'>Documentation Powered by Slate</a>

includes:
  - errors

search: true
---

# Introduction

Welcome to the avatarMate API! You can use our API to access avatarMate API endpoints, which can get avatars saved and create new avatars per user.

You can view code examples in the dark area to the right. On the left are details on what the endpoint expects as parameters.

# Authentication

> To authorize, use this code:

```shell
# With shell, you can just pass the correct header with each request
curl "https://avatarmate.herokuapp.com/api/v1/"
  -H "Authorization: Bearer api_key"
```

> Make sure to replace `api_key` with your API key.

avatarMate API uses API keys to allow access to the API. You can register a new avatarMate API key [here](https://avatarmate.herokuapp.com/signup) or receive one when creating a user as described below.

avatarMate API expects for the API key to be included in all API requests to the server in a header that looks like the following:

`Authorization: Bearer api_key`

<aside class="notice">
You must replace <code>api_key</code> with your personal API key.
</aside>

# Avatars

## Get All Avatars

```shell
curl "https://avatarmate.herokuapp.com/api/v1/avatars"
  -H "Authorization: Bearer api_key"
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": "5c0af34df63e7f00163069e0",
    "name": "demo",
    "link": "http://avatarmate.herokuapp.com/api/v1/avatars/view/5c0af34df63e7f00163069e0"
  },
  {
    "id": "5c0af440f63e7f00163069e0",
    "name": "demo",
    "link": "http://avatarmate.herokuapp.com/api/v1/avatars/view/5c0af440f63e7f00163069e0"
  },
]
```

This endpoint retrieves all avatars for current authorized user.

### HTTP Request

`GET https://avatarmate.herokuapp.com/api/v1/avatars`

## Get a Specific Avatar

```shell
curl "https://avatarmate.herokuapp.com/api/v1/avatars/<ID>"
  -H "Authorization: Bearer api_key"
```

> The above command returns JSON structured like this:

```json
{
  "name": "demo",
  "link": "http://avatarmate.herokuapp.com/api/v1/avatars/view/5c0af440f63e7f00163069e0",
  "base64": "data:image/png;base64,VBORw0KGgoAAAANSUhEUgAAAGYAAABmCAYAAAA53+R..."
}
```

This endpoint retrieves a specific avatar for current authorized user.

<!-- <aside class="warning">Inside HTML code blocks like this one, you can't use Markdown, so use <code>&lt;code&gt;</code> blocks to denote code.</aside> -->

### HTTP Request

`GET https://avatarmate.herokuapp.com/api/v1/avatars/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the avatar to retrieve

## Delete a Specific Avatar

```shell
curl "https://avatarmate.herokuapp.com/api/v1/avatars/<ID>"
  -X DELETE
  -H "Authorization: Bearer api_key"
```

> The above command returns JSON structured like this:

```json
{
  "message": "Successfully deleted avatar 5c0af440f63e7f00163069e0"
}
```

This endpoint deletes a specific avatar for current authorized user.

### HTTP Request

`DELETE https://avatarmate.herokuapp.com/api/v1/avatars/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the avatar to delete

