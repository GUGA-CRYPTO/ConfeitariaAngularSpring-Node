package com.aura.api.repository;

import com.aura.api.model.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {
    List<Despesa> findAllByOrderByDataDespesaDesc();
}
