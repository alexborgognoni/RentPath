<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case UnderReview = 'under_review';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Withdrawn = 'withdrawn';
    case Archived = 'archived';
    case Deleted = 'deleted';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Submitted => 'Submitted',
            self::UnderReview => 'Under Review',
            self::Approved => 'Approved',
            self::Rejected => 'Rejected',
            self::Withdrawn => 'Withdrawn',
            self::Archived => 'Archived',
            self::Deleted => 'Deleted',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'gray',
            self::Submitted => 'blue',
            self::UnderReview => 'yellow',
            self::Approved => 'green',
            self::Rejected => 'red',
            self::Withdrawn => 'orange',
            self::Archived => 'gray',
            self::Deleted => 'gray',
        };
    }

    /**
     * Check if status is visible to property manager.
     */
    public function isVisibleToManager(): bool
    {
        return ! in_array($this, [self::Draft, self::Withdrawn, self::Archived, self::Deleted]);
    }
}
