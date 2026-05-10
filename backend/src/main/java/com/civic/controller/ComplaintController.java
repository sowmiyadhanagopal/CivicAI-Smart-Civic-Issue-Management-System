package com.civic.controller;

import com.civic.entity.Complaint;
import com.civic.service.ComplaintService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String urgency,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sort) {

        return ResponseEntity.ok(
                complaintService.getFilteredComplaints(
                        search,
                        category,
                        urgency,
                        status,
                        sort
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(
                complaintService.getComplaintById(id)
        );
    }

    @GetMapping("/analytics")
    public ResponseEntity<java.util.Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(complaintService.getAnalytics());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> payload) {

        String newStatus = payload.get("status");

        return ResponseEntity.ok(
                complaintService.updateComplaintStatus(id, newStatus)
        );
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Complaint> submitComplaint(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        Complaint complaint = new Complaint();

        complaint.setTitle(title);
        complaint.setDescription(description);
        complaint.setLocation(location);

        return ResponseEntity.ok(
                complaintService.submitComplaint(complaint, image)
        );
    }
}