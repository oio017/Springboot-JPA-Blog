package com.cos.blog.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cos.blog.model.Slot;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Integer>{

//	@Query(value="SELECT * FROM DailySale WHERE id = ?1 AND date = ?2", nativeQuery = true)
	Slot findByVendingMachineIdAndSlotId(String merchantName, int slotId);

}
