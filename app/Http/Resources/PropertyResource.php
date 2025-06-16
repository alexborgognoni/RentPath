***REMOVED***

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
***REMOVED***
    public function toArray($request)
    ***REMOVED***
        return array_merge(parent::toArray($request), [
            'cover_image_url' => $this->cover_image_url,
            'photo_gallery' => $this->photo_gallery,
            // Include the full media data if needed
            'media' => $this->media
***REMOVED***
***REMOVED***
***REMOVED***
