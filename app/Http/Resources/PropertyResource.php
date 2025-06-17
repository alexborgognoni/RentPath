<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'cover_image_url' => $this->cover_image_url,
            'photo_gallery' => $this->photo_gallery,
        ]);
    }
}
