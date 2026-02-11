#!/usr/bin/env python3
import sys
import argparse

def generate_compose_template(service_name, image="nginx:latest"):
    """Generates a basic docker-compose.yml template."""
    template = f"""version: '3.8'

services:
  {service_name}:
    image: {image}
    ports:
      - "8080:80"
    restart: always
"""
    return template

def main():
    parser = argparse.ArgumentParser(description="Generate a Docker Compose template.")
    parser.add_argument("service_name", help="The name of the service.")
    parser.add_argument("--image", default="nginx:latest", help="The Docker image to use.")
    args = parser.parse_args()

    print(generate_compose_template(args.service_name, args.image))

if __name__ == "__main__":
    main()
