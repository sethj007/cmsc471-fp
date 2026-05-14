# FluLines

## What is FluLines? 
FluLines is an interactive data visualization exploring the phylogeography of H3N2 influenza — the dominant seasonal flu subtype responsible for many of the most severe flu seasons worldwide.

Phylogeography is the study of how evolutionary history and geographic spread are intertwined: where a virus mutates, and how those mutations travel across the world.

FluLines was designed to make these otherwise invisible processes visible. Using genomic sequence data and global surveillance records, the visualization allows users to observe H3N2 evolution in real time — branch by branch, year by year, and country by country.


The goal of FluLines is to help users better understand:
- How influenza evolves over time
- How viral lineages spread geographically
- The relationship between mutation, transmission, and global circulation
- The importance of genomic surveillance in public health

Through interactive visualization, FluLines transforms complex phylogenetic and epidemiological data into an accessible exploratory experience.

## Project Contributors
### Seth Johnston
- Created the baseline visualization architecture
- Wrote the phylogenetic tree implementation and visualization
- Developed temporal playback systems
- Added tooltips on hover
### Aditya Gupta
- Performed data cleaning on location data
- Enhanced the visualization interface and usability
 (e.g, allowed scrolling of time wheel while playing, synced story panels with time wheel both ways, smoothed transfer between viewing windows)
- Added auxillary features such as country highlighting on tree hover in the both panel
- Lots and lots of bugfixing!
### Alexander Chen
- Authored the original project proposal
- Designed the overall visualization concept and structure
- Contributed to webpage writing and visualization refinement
- Primary member involved in preparing for both Final Project Showcase and milestone talk-through

## Data & Acknowledgement
The two major sources of data for this project are 

- [GISAID](https://gisaid.org/phylogeny-influenza/influenza-h3n2/)

- [World Health Organization Flunet](https://www.who.int/tools/flunet)

FluLines was also inspired by [Nextstrain's](https://nextstrain.org/seasonal-flu/h3n2/ha/2y) real-time genomic tracking and visualization of the hemagglutinin (HA) segment of H3N2 influenza across a twelve-year period.

