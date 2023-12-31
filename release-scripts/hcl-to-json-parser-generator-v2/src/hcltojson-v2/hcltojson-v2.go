package main

import (
	"github.com/gopherjs/gopherjs/js"
	"github.com/khulnasoft-lab/vulnmap-iac-parsers/terraform"
)

func main() {
	js.Module.Get("exports").Set("parseModule", parseModule)
}

func parseModule(files map[string]interface{}) map[string]interface{} {
	return terraform.ParseModule(files)
}