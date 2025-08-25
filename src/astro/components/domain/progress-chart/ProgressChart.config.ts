import {curveStepAfter, format, formatDefaultLocale, group, groups} from "d3";

import acceleratorsInUse from "./data/acceleratorsInUsePerYear.json" assert {type: "json"};

import nuclideDiscoveriesPerYear from "./data/nuclideDiscoveriesPerYear.json" assert {type: "json"};

import _particleDiscoveries from "./data/particleDiscoveries.json" assert {type: "json"};

import pdbEntries from "./data/proteinStructures.json" assert {type: "json"};

import _nobelPrizes from "./data/nobelPrizes.json" assert {type: "json"};

import conferences from "./data/conferences.json" assert {type: "json"};

import professorships from "./data/professorships.json" assert {type: "json"};

import publications from "./data/publications__prab.tsv"
import publications__prab from "./data/publications__prab.json" assert {type: "json"};
import publications_openAlex from "./data/publications_open-alex.json" assert {type: "json"};
import doctoralTheses from "./data/doctoralTheses.json" assert {type: "json"};
import masterTheses from "./data/masterTheses.json" assert {type: "json"};

import betaElectron from "./data/betaElectron.json" assert {type: "json"};

import betaProton from "./data/betaProton.json" assert {type: "json"};

import energyProton from "./data/energyProton.json" assert {type: "json"};

import energyElectron from "./data/energyElectron.json" assert {type: "json"};

import magneticFieldStrength from "./data/magneticFieldStrength.json" assert {type: "json"};

import srfGradient from "./data/srfGradient.json" assert {type: "json"};

import emittance from "./data/emittance.json" assert {type: "json"};

import currentProton from "./data/currentProton.json" assert {type: "json"};

import peakLuminosity from "./data/peakLuminosity.json" assert {type: "json"};

import peakBrilliance from "./data/peakBrilliance.json" assert {type: "json"};

import neutronFlux from "./data/neutronFlux.json" assert {type: "json"};

import projectFunding
  from "./data/projektfoerderung_pt-desy.2-aggregated.accelerator_related_projects_per_year.json" assert {type: "json"};
import excellenceRate from "./data/excellence-rate.json" assert {type: "json"};

const nobelPrizes = Array.from(
  groups(Object.values(_nobelPrizes), ({ year }) => year),
).map(([y, v]) => ({ year: y, value: v.length }));

const particleDiscoveries = Array.from(
  group(Object.values(_particleDiscoveries), ({ year }) => year),
).map(([y, v]) => ({
  year: y,
  value: v.length,
}));
// .map((v, k) => {year: +k, value: v.length})

const projectFundingProjectsCount = projectFunding.data.map((entry) => ({
  year: entry.year,
  value: entry.projects__count,
}));
const projectFundingAmount = projectFunding.data.map((entry) => ({
  year: entry.year,
  value: entry.funding_amount__sum,
}));

const germanExcellenceRate = Object.values(excellenceRate).map((entry) => ({
  year: entry.yearEnd,
  value: entry["ten percent most cited with affiliation from Germany share"],
}));

formatDefaultLocale({
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", "\u00A0€"],
});

export default {
  nuclideDiscoveriesPerYear: {
    yDomain: [0, 5000],
    scale: "linear",
    cumulate: false,
    data: Object.values(nuclideDiscoveriesPerYear).map(({ year, sum }) => ({
      year,
      value: sum,
    })),
    quantityName: "Nuklidentdeckungen",
    quantityNameQualifier: "",
    unit: "kumulierte Zahl der an Beschleunigern entdeckten Nuklide",
  },
  particleDiscoveries: {
    yDomain: [0, 25],
    scale: "linear",
    cumulate: true,
    data: particleDiscoveries,
    quantityName: "Elementarteilchen",
    quantityNameQualifier: "",
    unit: "an Beschleunigern entdeckt (kumuliert)",
    curveGenerator: curveStepAfter,
  },
  pdbEntries: {
    yDomain: [0, 100000],
    scale: "linear",
    cumulate: false,
    data: Object.values(pdbEntries).map(
      ({ year, count__acceleratorBasedXcd }) => ({
        year,
        value: count__acceleratorBasedXcd,
      }),
    ),
    quantityName: "Bio-Moleküle",
    quantityNameQualifier: "",
    unit: "an Beschleuniger-Lichtquellen entschlüsselt",
    curveGenerator: curveStepAfter,
  },
  accelerator_related__nobel_prizes: {
    yDomain: [0, 25],
    scale: "linear",
    cumulate: true,
    data: nobelPrizes,
    quantityName: "Nobelpreise mit Beschleunigerbezug",
    quantityNameQualifier: "",

    curveGenerator: curveStepAfter,
  },

  accelerators_in_use__medicine: {
    yDomain: [0, 25000],
    scale: "linear",
    cumulate: false,
    data: Object.values(acceleratorsInUse).map(({ year, medicine__count }) => ({
      year,
      value: medicine__count,
    })),
    quantityName: "Beschleuniger in der Medizin",

    // unit: 'kumulierte Anzahl',
  },
  accelerators_in_use__industry: {
    yDomain: [0, 25000],
    scale: "linear",
    cumulate: false,
    data: Object.values(acceleratorsInUse).map(({ year, industry__count }) => ({
      year,
      value: industry__count,
    })),
    quantityName: "Beschleuniger in der Industrie",
  },
  accelerators_in_use__science: {
    yDomain: [0, 25000],
    scale: "linear",
    cumulate: false,
    data: Object.values(acceleratorsInUse).map(({ year, science__count }) => ({
      year,
      value: science__count,
    })),
    quantityName: "Beschleuniger für die Wissenschaft",

    // unit: 'kumulierte Anzahl',
  },
  progress__conferences: {
    yDomain: [0, 250],
    scale: "linear",
    cumulate: true,
    data: groups(Object.values(conferences), (d) => d.year)
      .map((d) => ({ year: d[0], value: d[1].length }))
      .sort((d, e) => d.year - e.year),
    quantityName: "Konferenzen",
    quantityNameQualifier: "Internationale ",
    unit: "kumuliert Jahr",
    curveGenerator: curveStepAfter,
  },
  progress__doctoral_theses: {
    yDomain: [0, 250],
    scale: "linear",
    cumulate: true,
    data: Object.values(doctoralTheses),
    quantityName: "Dissertationen",
    quantityNameQualifier: " ",
    unit: "pro Jahr",
    curveGenerator: curveStepAfter,
  },
  progress__master_theses: {
    yDomain: [0, 250],
    scale: "linear",
    cumulate: true,
    data: Object.values(masterTheses),
    quantityName: "Masterarbeiten",
    quantityNameQualifier: " ",
    unit: "pro Jahr",
    curveGenerator: curveStepAfter,
  },
  progress__professorships: {
    scale: "linear",
    yDomain: [0, 50],
    cumulate: true,
    data: Object.values(professorships),
    quantityName: "Professuren",
    quantityNameQualifier: "Einschlägige ",
    unit: "an deutschen Universitäten (kumuliert)",
    curveGenerator: curveStepAfter,
  },
  progress__publications__prab: {
    scale: "linear",
    yDomain: [0, 5000],
    cumulate: true,
    data: Object.values(publications).sort((a, b) => a.year - b.year),
    quantityName: "Veröffentlichungen",
    quantityNameQualifier: "Akademenische ",
    unit: "in Physics Review Accelerators and Beams pro Jahr",
    curveGenerator: curveStepAfter,
  },
  progress__publications: {
    scale: "linear",
    yDomain: [0, 250000],
    cumulate: true,
    data: Object.values(publications_openAlex).sort((a, b) => a.year - b.year),
    quantityName: "Veröffentlichungen",
    quantityNameQualifier: "Akademenische ",
    unit: "Open Alex",
    curveGenerator: curveStepAfter,
  },
  progress__projectFundingCount: {
    scale: "linear",
    yDomain: [0, 500],
    cumulate: true,
    data: projectFundingProjectsCount,
    quantityName: "Projektförderung",
    quantityNameQualifier: "Verbundforschung ",
    unit: "Projekte",
    curveGenerator: curveStepAfter,
  },
  progress__projectFundingAmount: {
    scale: "linear",
    yDomain: [0, 250000000],
    cumulate: true,
    data: projectFundingAmount,
    quantityName: "Projektförderung",
    quantityNameQualifier: "Verbundforschung ",
    unit: "Fördersumme in Euro",
    curveGenerator: curveStepAfter,
  },
  progress__excellenceRate: {
    scale: "linear",
    yDomain: [0, 0.5],
    cumulate: false,
    data: germanExcellenceRate,
    quantityName: "Exzellenzrate",
    quantityNameQualifier: "Deutsche ",
    unit: "ten percent most cited share",
    curveGenerator: curveStepAfter,
    numberFormat: format(".0"),
  },
  progress__beta_electron: {
    scale: "log",
    y0: -2,
    yFactor: 3,
    data: betaElectron,
    quantityName: "Geschwindigkeit",
    quantityNameQualifier: "Elektronen-",
    unit: "Lichtgeschwindigkeit",
    numberFormat: format(".0%"),
  },
  progress__beta_proton: {
    scale: "log",
    y0: -2,
    yFactor: 3,
    data: betaProton,
    quantityName: "Geschwindigkeit",
    quantityNameQualifier: "Protonen-",
    unit: "Lichtgeschwindigkeit",
    // numberFormat: format('.0%'),
  },
  progress__energy_proton: {
    scale: "log",
    y0: 0,
    yFactor: 20,
    data: energyProton,
    quantityName: "Energie",
    quantityNameQualifier: "Protonen-",
    unit: "Eletronenvolt",
    regression: true,
  },
  progress__energy_electron: {
    scale: "log",
    y0: 0,
    yFactor: 20,
    data: energyElectron,
    quantityName: "Energie",
    quantityNameQualifier: "Elektronen-",
    unit: "Eletronenvolt",
    regression: true,
  },

  progress__magnetic_field_strength: {
    scale: "linear",
    yDomain: [0, 20],
    data: magneticFieldStrength,
    quantityName: "Magnetfeldstärke",
    quantityNameQualifier: "Maximale ",
    unit: "Tesla (T)",
    regression: false,
  },
  progress__srf_gradient: {
    scale: "linear",
    yDomain: [0, 100],
    data: srfGradient,
    quantityName: "elektrischer Gradient",
    quantityNameQualifier: "Maximaler ",
    unit: "Millionen Volt pro Meter (MV/m)",
    regression: false,
  },
  progress__emittance: {
    scale: "log",
    y0: 0,
    yFactor: 10,
    data: emittance,
    quantityName: "Emittanz",
    quantityNameQualifier: "horizontale ",
    unit: "Billionstel Meterradian (pmrad)",
    regression: true,
  },
  progress__current_proton: {
    scale: "log",
    y0: 5,
    yFactor: 10,
    data: currentProton,
    quantityName: "Strom",
    quantityNameQualifier: "maximaler ",
    unit: "Ampere",
    regression: true,
  },
  progress__peak_luminosity: {
    scale: "log",
    y0: 0,
    yFactor: 10,
    data: Object.values(peakLuminosity).map((d) => ({
      ...d,
      value: d.value / 1e30,
    })),
    quantityName: "Luminosität",
    quantityNameQualifier: "Spitzen",
    unit: "Quintillion Ereignisse / cm&sup2; / s",
    regression: true,
  },
  progress__neutron_flux: {
    scale: "log",
    y0: 0,
    yFactor: 20,
    data: neutronFlux,
    quantityName: "Fluss thermischer Neutronen",
    quantityNameQualifier: "",
    unit: "Neutronen / cm&sup2; / s",
    regression: false,
  },
  progress__peak_brilliance: {
    scale: "log",
    y0: 0,
    yFactor: 50,
    data: Object.values(peakBrilliance)
      // .slice(1, -1)
      .map((d) => ({ ...d, value: d.value / 1 })),
    quantityName: "Brillianz",
    quantityNameQualifier: "Spitzen",
    unit: "Photonen / cm² / s",
  },
};
