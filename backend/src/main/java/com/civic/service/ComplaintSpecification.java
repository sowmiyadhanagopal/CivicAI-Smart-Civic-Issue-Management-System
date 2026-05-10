package com.civic.service;

import com.civic.entity.Complaint;
import org.springframework.data.jpa.domain.Specification;

public class ComplaintSpecification {

    public static Specification<Complaint> filterComplaints(
            String search,
            String category,
            String urgency,
            String status
    ) {

        return (root, query, criteriaBuilder) -> {

            var predicate = criteriaBuilder.conjunction();

            if (search != null && !search.isEmpty()) {
                var searchPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + search.toLowerCase() + "%"),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), "%" + search.toLowerCase() + "%"),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), "%" + search.toLowerCase() + "%")
                );

                predicate = criteriaBuilder.and(predicate, searchPredicate);
            }

            if (category != null && !category.isEmpty() && !category.equals("All Categories")) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("category"), category)
                );
            }

            if (urgency != null && !urgency.isEmpty() && !urgency.equals("All")) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("urgency"), urgency)
                );
            }

            if (status != null && !status.isEmpty() && !status.equals("All Statuses")) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("status"), status)
                );
            }

            return predicate;
        };
    }
}