package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/skip2/go-qrcode"
)

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
	}))

	app.Get("/api/download", func(c fiber.Ctx) error {
		couponID := "PHAR-1128"

		png, err := qrcode.Encode(couponID, qrcode.Medium, 512)
		if err != nil {
			return c.Status(500).SendString("Gagal generate")
		}

		c.Set("Content-Disposition", "attachment; filename=coupon-qr.png")
		c.Set("Content-Type", "image/png")

		return c.Send(png)
	})

	app.Get("/api/generate-dynamic", func(c fiber.Ctx) error {

		userInput := c.Query("text", "Default-Text")

		png, err := qrcode.Encode(userInput, qrcode.Medium, 512)
		if err != nil {
			return c.Status(500).SendString("Gagal generate")
		}

		fileName := fmt.Sprintf("attachment; filename=qr-%s.png", userInput)
		c.Set("Content-Disposition", fileName)
		c.Set("Content-Type", "image/png")

		return c.Send(png)
	})

	fmt.Println("Backend berjalan di http://localhost:3000")
	log.Fatal(app.Listen(":3000"))
}
