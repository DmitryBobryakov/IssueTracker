package com.netcracker.edu.tms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name="name", unique = true, nullable = false)
    private String name;

    public Role(String name) {
        this.name = name;
    }

    public static void clone(Role source, Role destination){
        destination.id = source.id;
        destination.name = source.name;
    }
}