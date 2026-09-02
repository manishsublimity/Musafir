# Musafir — Pixabay Media Manifest

Source: https://pixabay.com/
License reference: https://pixabay.com/service/license-summary/

## Important
This manifest is based on the uploaded Musafir media manifest. It contains the required Pixabay search targets and suggested filenames. It does **not** embed or redistribute Pixabay media files.

Pixabay permits use of its content under its Content License, but its Terms prohibit bulk/large-scale/systematic copying unless Pixabay has granted explicit permission. Therefore this file is designed as a cloud-ready asset sourcing manifest rather than a bulk downloader.

## Required media

### Countries — photos + videos

| Slug | Country | Photo filename | Photo search | Video filename | Video search |
|---|---|---|---|---|---|
| australia | Australia | australia.jpg | https://pixabay.com/images/search/australia%20travel/ | australia.mp4 | https://pixabay.com/videos/search/australia%20travel/ |
| bali | Bali | bali.jpg | https://pixabay.com/images/search/bali%20travel/ | bali.mp4 | https://pixabay.com/videos/search/bali%20travel/ |
| maldives | Maldives | maldives-overwater.jpg | https://pixabay.com/images/search/maldives%20overwater/ | maldives.mp4 | https://pixabay.com/videos/search/maldives%20travel/ |
| dubai | Dubai | dubai.jpg | https://pixabay.com/images/search/dubai%20travel/ | dubai.mp4 | https://pixabay.com/videos/search/dubai%20travel/ |
| thailand | Thailand | thailand.jpg | https://pixabay.com/images/search/thailand%20travel/ | thailand.mp4 | https://pixabay.com/videos/search/thailand%20travel/ |
| switzerland | Switzerland | swiss-alps.jpg | https://pixabay.com/images/search/switzerland%20alps/ | switzerland.mp4 | https://pixabay.com/videos/search/switzerland%20travel/ |
| vietnam | Vietnam | vietnam.jpg | https://pixabay.com/images/search/vietnam%20travel/ | vietnam.mp4 | https://pixabay.com/videos/search/vietnam%20travel/ |
| japan | Japan | kyoto-temple.jpg | https://pixabay.com/images/search/japan%20kyoto/ | japan.mp4 | https://pixabay.com/videos/search/japan%20travel/ |
| mauritius | Mauritius | mauritius.jpg | https://pixabay.com/images/search/mauritius%20travel/ | mauritius.mp4 | https://pixabay.com/videos/search/mauritius%20travel/ |
| malaysia | Malaysia | malaysia.jpg | https://pixabay.com/images/search/malaysia%20travel/ | malaysia.mp4 | https://pixabay.com/videos/search/malaysia%20travel/ |
| kashmir | Kashmir | kashmir.jpg | https://pixabay.com/images/search/kashmir%20india/ | kashmir.mp4 | https://pixabay.com/videos/search/kashmir%20india/ |
| kerala | Kerala | kerala.jpg | https://pixabay.com/images/search/kerala%20india/ | kerala.mp4 | https://pixabay.com/videos/search/kerala%20india/ |
| ladakh | Ladakh | ladakh.jpg | https://pixabay.com/images/search/ladakh%20india/ | ladakh.mp4 | https://pixabay.com/videos/search/ladakh%20india/ |
| rajasthan | Rajasthan | rajasthan.jpg | https://pixabay.com/images/search/rajasthan%20india/ | rajasthan.mp4 | https://pixabay.com/videos/search/rajasthan%20india/ |
| meghalaya | Meghalaya | meghalaya.jpg | https://pixabay.com/images/search/meghalaya%20india/ | meghalaya.mp4 | https://pixabay.com/videos/search/meghalaya%20india/ |
| andaman | Andaman Islands | andaman.jpg | https://pixabay.com/images/search/andaman%20islands/ | andaman.mp4 | https://pixabay.com/videos/search/andaman%20islands/ |
| goa | Goa | goa.jpg | https://pixabay.com/images/search/goa%20india/ | goa.mp4 | https://pixabay.com/videos/search/goa%20india/ |
| sikkim | Sikkim & Darjeeling | sikkim.jpg | https://pixabay.com/images/search/sikkim%20darjeeling/ | sikkim.mp4 | https://pixabay.com/videos/search/sikkim%20darjeeling/ |

## Travel vibes — optional photos + videos

| ID | Photo filename | Photo search | Video filename | Video search |
|---|---|---|---|---|
| LEISURE | leisure.jpg | https://pixabay.com/images/search/leisure%20travel/ | leisure.mp4 | https://pixabay.com/videos/search/leisure%20travel/ |
| NATURE | nature.jpg | https://pixabay.com/images/search/nature%20travel/ | nature.mp4 | https://pixabay.com/videos/search/nature%20travel/ |
| ATTRACTION | attraction.jpg | https://pixabay.com/images/search/tourist%20attraction/ | attraction.mp4 | https://pixabay.com/videos/search/tourist%20attraction/ |
| CULTURE | culture.jpg | https://pixabay.com/images/search/travel%20culture/ | culture.mp4 | https://pixabay.com/videos/search/travel%20culture/ |
| ADVENTURE | adventure.jpg | https://pixabay.com/images/search/adventure%20travel/ | adventure.mp4 | https://pixabay.com/videos/search/adventure%20travel/ |

## Party types — optional videos

| ID | Filename | Search |
|---|---|---|
| COUPLE | couple.mp4 | https://pixabay.com/videos/search/couple%20travel/ |
| FAMILY | family.mp4 | https://pixabay.com/videos/search/family%20travel/ |
| FRIENDS | friends.mp4 | https://pixabay.com/videos/search/friends%20travel/ |
| SOLO | solo.mp4 | https://pixabay.com/videos/search/solo%20travel/ |

## Cities — optional

The source manifest lists 58 cities and says city photos are optional. If added, use:

`/images/cities/<country-slug>/<city-slug>.jpg`

and search Pixabay using the exact city name plus `travel`.

## Cloud integration

Recommended structure:

```text
/public/media/
  images/
    australia.jpg
    bali.jpg
    maldives-overwater.jpg
    ...
  videos/
    australia.mp4
    bali.mp4
    maldives.mp4
    ...
```

For videos, host the selected files on your own CDN/object storage and use absolute HTTPS URLs in the application:

```ts
video: { mp4: "https://YOUR-CDN.example.com/musafir/videos/bali.mp4" }
```

For images:

```ts
src: "/images/bali.jpg"
```

Keep a record of each selected Pixabay asset's original Pixabay page URL and download date so the project can retain provenance.

## Source manifest coverage

The uploaded source identifies 18 countries, 5 travel vibes, 58 optional cities, 4 party types, and 4 duration options. Duration needs no media. The source specifically calls for 18 country videos and 13 missing country photos, with optional city/vibe/party media. 
