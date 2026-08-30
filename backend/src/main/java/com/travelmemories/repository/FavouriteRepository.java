package com.travelmemories.repository;

import com.travelmemories.model.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    List<Favourite> findByUserId(Long userId);
}
