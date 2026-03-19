package com.kidsgames.controller;

import com.kidsgames.config.AuthenticatedUser;
import com.kidsgames.model.Profile;
import com.kidsgames.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public List<Profile> getMyProfiles(@AuthenticationPrincipal AuthenticatedUser user) {
        return profileService.getProfilesByUser(user.getUserId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfileById(@PathVariable Long id,
                                                   @AuthenticationPrincipal AuthenticatedUser user) {
        return profileService.getProfileById(id)
                .filter(p -> p.getUserId().equals(user.getUserId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Profile> createProfile(@Valid @RequestBody Profile profile,
                                                  @AuthenticationPrincipal AuthenticatedUser user) {
        profile.setUserId(user.getUserId());
        return ResponseEntity.ok(profileService.createProfile(profile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProfile(@PathVariable Long id,
                                            @AuthenticationPrincipal AuthenticatedUser user) {
        return profileService.getProfileById(id)
                .filter(p -> p.getUserId().equals(user.getUserId()))
                .map(p -> {
                    profileService.deleteProfile(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
