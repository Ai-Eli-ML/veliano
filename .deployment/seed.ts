import { seedDatabase } from "@/lib/seed-data"

async function main() {
  try {
    console.log("Starting database seeding...")
    const result = await seedDatabase()
    
    if (result.success) {
      console.log("Database seeded successfully!")
    } else {
      console.error("Error seeding database:", result.error)
      process.exit(1)
    }
  } catch (error) {
    console.error("Fatal error during seeding:", error)
    process.exit(1)
  }
}

main() 