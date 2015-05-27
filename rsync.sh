#!/bin/bash
rsync -avze ssh /Projects/etiologi.es/site/ robin@$POLITY:/var/www/sites/etiologi.es/public/
