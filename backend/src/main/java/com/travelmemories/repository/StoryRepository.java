package com.travelmemories.repository;

import com.travelmemories.model.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByUserIdOrderByStoryDateDesc(Long userId);
}
