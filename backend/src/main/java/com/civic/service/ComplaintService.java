package com.civic.service;

import com.civic.entity.Complaint;
import com.civic.repository.ComplaintRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    public java.util.Map<String, Object> getAnalytics() {
        List<Complaint> complaints = getAllComplaints();
        long total = complaints.size();
        long pending = complaints.stream().filter(c -> "PENDING".equalsIgnoreCase(c.getStatus())).count();
        long resolved = complaints.stream().filter(c -> "RESOLVED".equalsIgnoreCase(c.getStatus())).count();
        long highUrgency = complaints.stream().filter(c -> "HIGH".equalsIgnoreCase(c.getUrgency())).count();

        java.util.Map<String, Long> byCategoryMap = complaints.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        c -> c.getCategory() != null ? c.getCategory() : "General",
                        java.util.stream.Collectors.counting()
                ));
        List<java.util.Map<String, Object>> byCategory = byCategoryMap.entrySet().stream()
                .map(e -> {
                    java.util.Map<String, Object> m = new java.util.HashMap<>();
                    m.put("name", e.getKey());
                    m.put("value", e.getValue());
                    return m;
                }).collect(java.util.stream.Collectors.toList());

        java.util.Map<String, Long> byUrgencyMap = complaints.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        c -> c.getUrgency() != null ? c.getUrgency().toUpperCase() : "LOW",
                        java.util.stream.Collectors.counting()
                ));
        List<java.util.Map<String, Object>> byUrgency = byUrgencyMap.entrySet().stream()
                .map(e -> {
                    java.util.Map<String, Object> m = new java.util.HashMap<>();
                    m.put("name", e.getKey());
                    m.put("value", e.getValue());
                    return m;
                }).collect(java.util.stream.Collectors.toList());

        java.util.Map<String, Long> overTimeMap = complaints.stream()
                .filter(c -> c.getCreatedAt() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        c -> c.getCreatedAt().toLocalDate().toString(),
                        java.util.stream.Collectors.counting()
                ));
        List<java.util.Map<String, Object>> overTime = overTimeMap.entrySet().stream()
                .map(e -> {
                    java.util.Map<String, Object> m = new java.util.HashMap<>();
                    m.put("date", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                })
                .sorted((m1, m2) -> ((String) m1.get("date")).compareTo((String) m2.get("date")))
                .collect(java.util.stream.Collectors.toList());

        java.util.Map<String, Object> analytics = new java.util.HashMap<>();
        analytics.put("totalComplaints", total);
        analytics.put("pendingComplaints", pending);
        analytics.put("resolvedComplaints", resolved);
        analytics.put("highUrgencyComplaints", highUrgency);
        analytics.put("categoryData", byCategory);
        analytics.put("urgencyData", byUrgency);
        analytics.put("timelineData", overTime);

        return analytics;
    }

    public List<Complaint> getFilteredComplaints(
            String search,
            String category,
            String urgency,
            String status,
            String sortParam
    ) {

        Specification<Complaint> spec =
                ComplaintSpecification.filterComplaints(
                        search,
                        category,
                        urgency,
                        status
                );

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        return complaintRepository.findAll(spec, sort);
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Complaint not found"));
    }

    public Complaint updateComplaintStatus(Long id, String newStatus) {

        Complaint complaint = getComplaintById(id);

        complaint.setStatus(newStatus);

        return complaintRepository.save(complaint);
    }

    public Complaint submitComplaint(
            Complaint complaint,
            MultipartFile image
    ) {

        complaint.setCategory(
                detectCategory(
                        complaint.getDescription()
                )
        );

        complaint.setUrgency(
                detectUrgency(
                        complaint.getDescription()
                )
        );

        List<Complaint> allComplaints =
                complaintRepository.findAll();

        for (Complaint existing : allComplaints) {

            if (isDuplicate(complaint, existing)) {

                if (existing.getReportCount() == null) {
                    existing.setReportCount(1);
                }

                existing.setReportCount(
                        existing.getReportCount() + 1
                );

                return complaintRepository.save(existing);
            }
        }

        complaint.setReportCount(1);

        return complaintRepository.save(complaint);
    }

private boolean isDuplicate(
        Complaint c1,
        Complaint c2
) {

    String loc1 =
            c1.getLocation() != null
                    ? c1.getLocation().toLowerCase().trim()
                    : "";

    String loc2 =
            c2.getLocation() != null
                    ? c2.getLocation().toLowerCase().trim()
                    : "";

    String cat1 =
            c1.getCategory() != null
                    ? c1.getCategory().toLowerCase().trim()
                    : "";

    String cat2 =
            c2.getCategory() != null
                    ? c2.getCategory().toLowerCase().trim()
                    : "";

    return loc1.equals(loc2)
            && cat1.equals(cat2);
}
    private String detectCategory(String text) {

        text = text.toLowerCase();

        if (text.contains("water")
                || text.contains("leak")
                || text.contains("drain")) {

            return "Water Supply";
        }

        if (text.contains("road")
                || text.contains("pothole")) {

            return "Infrastructure";
        }

        if (text.contains("wire")
                || text.contains("electric")) {

            return "Electricity";
        }

        return "General";
    }

    private String detectUrgency(String text) {

        text = text.toLowerCase();

        if (text.contains("danger")
                || text.contains("fire")
                || text.contains("live wire")) {

            return "HIGH";
        }

        if (text.contains("issue")
                || text.contains("problem")) {

            return "MEDIUM";
        }

        return "LOW";
    }
}