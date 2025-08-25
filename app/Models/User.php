<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function boards()
    {
        return $this->hasMany(Board::class, 'owner_id');
    }

    public function ownedTasks()
    {
        return $this->hasMany(Task::class, 'reporter_id');
    }

    public function assignedTasks()
    {
        // TODO add relationship for tasks assigned to user via shared boards
    }

    public function getTasks()
    {
        // TODO return all tasks assigned to or reported by user in all boards they have access to
        // Should return a lazy collection of Task models
    }
}
