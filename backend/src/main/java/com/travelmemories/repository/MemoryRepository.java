package com.travelmemories.repository;

import com.travelmemories.model.Memory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MemoryRepository extends JpaRepository<Memory, Long> {
    List<Memory> findByUserIdOrderByMemoryDateDesc(Long userId);
    List<Memory> findByTripId(Long tripId);
}
