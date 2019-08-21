package main

import "net/http"

func init() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        // no op
    })
}
