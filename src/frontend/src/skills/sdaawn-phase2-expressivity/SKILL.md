---
name: sdaawn-phase2-expressivity
description: Implement Phase 2 expressive identity: quadruped/taur/winged locomotion, expressive autonomy (tails, ears, wings), species-appropriate emotes, plurality support.
---

# SDAAWN Phase 2: Expressive Identity

## Quadruped and Locomotion

### Form Types
- **Humanoid**: Human-like form, ground-level, versatile
- **Taur**: Humanoid upper body + 4 legs, quadrupedal movement
- **Quadruped**: 4 legs, no humanoid upper body, ground-level
- **Winged**: Humanoid upper body + 2 wings, aerial capability

### Movement Animation
- Each form has unique movement physics
- Taur: 4-legged gait (walking, trotting, galloping)
- Quadruped: 4-legged ground movement
- Winged: flight and gliding
- Humanoid: walking, running

## Expressive Autonomy

### Tail (Taur/Quadruped forms)
- States: neutral, happy, curious, annoyed
- Movement: sway, wag, twitch

### Ears (Humanoid/Taur/Winged)
- States: alert, relaxed, sleeping, curious
- Movement: perky, floppy, twitch

### Wings (Winged form)
- States: idle, flapping, resting, spreading
- Movement: subtle wing beat when flying

### Body Sway
- Subtle movement when idle
- Syncs with breathing or ambient movement

### Eye Contact
- Follows mouse cursor
- Tracks user position in 3D space

## Species-Appropriate Emotes

### Humanoid
- Wave
- Dance
- Thumbs up
- Hug
- Bow

### Taur
- Ears up
- Tail swish
- Happy
- Proud
- Sleepy

### Winged
- Wing flap
- Gentle glide
- Happy wing spread

### Quadruped
- Sniff
- Stretch
- Wag
- Lie down

## Plurality Support

- Multiple forms in one account
- Private kintype notes (not shared)
- Form switching with smooth transition
- Private form selection menu

## UI Components

- AvatarCreator: Full customization panel
- AvatarSelector: Quick form switching
- EmotePicker: Gallery of available emotes
- PluralityManager: Manage multiple forms
