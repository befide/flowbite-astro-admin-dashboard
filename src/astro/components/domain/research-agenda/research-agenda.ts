import {arc, cluster, type HierarchyNode, hsl, rgb, ribbon, scaleOrdinal, select, stratify} from "d3";

import css from "./research-agenda.css";

import {JSDOM} from "jsdom";

import _data from "./research-agenda.json";
import type {HierarchyPointNode} from "d3-hierarchy";

export interface ResearchAgendaItem {
  additionalUserGroups?: string[];
  ancestors?: string[];
  description?: string;
  facilityName?: string;
  facilityVersion?: string;
  group?: string;
  id: string;
  isBmbfFis?: boolean;
  isInGermany?: boolean;
  label: string;
  lifeCycleStage?: string;
  links: string[];
  name: string;
  nameIsAcronymFor?: string;
  parent?: string;
  path: string;
  usedInResearchAgenda: boolean;
  userGroup?: string;
}

export type ResearchAgenda = ResearchAgendaItem[];

export type ResearchAgendaItemHierarchyNode = HierarchyNode<ResearchAgendaItem>

export const createResearchAgenda = (filter = "agenda.facilities") => {
  const dTheta = 0.0;

  const activeElements = new Set<string>();

  const baselineHeight = 14;
  const radius = 8 * baselineHeight;
  const height = (12 * 4 - 1) * baselineHeight;
  const width = (12 * 4 - 1) * baselineHeight;

  const red = hsl(rgb("#c53228"));
  const blue = hsl(rgb("#2174a8"));
  const green = hsl(rgb("#009900"));

  function color(d: HierarchyNode<ResearchAgendaItem>) {
    return scaleOrdinal(
      ["topics", "facilities", "objectives"],
      [red.toString(), blue.toString(), green.toString()],
    )(d.data.ancestors![2]);
  }

  function nameFixer(label = "") {
    return label
      .replace("Strahlmodellierung", "Modellierung")
      .replace("3. Ultrakompakte Anlagen", "3. Ultrakompakt")
      .replace("particle-physics", "Teilchenphysik")
      .replace("hadron-physics", "Kernphysik")
      .replace("accelerator-science", "Beschleunigerforschung")
      .replace("photon-science", "Photonen")
      .replace("neutron-science", "Neutronen")
      .replace("Teilchen-Plasma-Beschleuniger", "Teilchen-Plasma")
      .replace("Laser-Plasma-Beschleuniger", "Laser-Plasma");
  }

  let researchAgenda: ResearchAgendaItem[] = Object.values(_data).map((d) => ({
    ...d,
    path: d.path, //.replaceAll('.', '/'),
    ancestors: d.path.split(".").reverse(),
    name: nameFixer(d.name),
    group: nameFixer(d.group),
  }));

  const itemsById = new Map<string, any>(researchAgenda.map((d) => [d.id, d]));

  researchAgenda.forEach((d) => {
    d.links = d.links.map((id, i) => itemsById.get(id)?.path);
  });


  const stratified: HierarchyNode<ResearchAgendaItem> =
    stratify<ResearchAgendaItem>().path((d: ResearchAgendaItem) =>
      d.path.replaceAll(".", "/"),
    )(researchAgenda);

  const clusterLayout = cluster<ResearchAgendaItem>()
    .size([2 * Math.PI, radius])
    .separation((a, b) => {
      if (
        a.data.ancestors &&
        b.data.ancestors &&
        a.data.ancestors[2] !== b.data.ancestors[2]
      )
        return 3;
      if (
        a.data.ancestors &&
        b.data.ancestors &&
        a.data.ancestors[1] !== b.data.ancestors[1]
      )
        return 2;
      return 1;
    })(stratified);

  clusterLayout.leaves().forEach((d) => {
    if (d.data.path.includes(filter)) activeElements.add(d.data.path);
  });

  const links = clusterLayout.leaves().flatMap((leaf) =>
    leaf.data.links
      .map((link) => ({
        source: leaf.data.path,
        target: link,
        id: leaf.data.path + "-" + link,
      }))
      .filter((d) => d.target),
  );

  links.forEach((link) => {
    if (link.source.includes(filter)) {
      activeElements.add(link.target);
      activeElements.add(link.source);
    }
  });

  const clusterLayoutLeavesByPath = new Map<string, any>(
    clusterLayout.leaves().map((d) => [d.data.path, d]),
  );

  const {document} = new JSDOM().window;
  const svg = select(document.body).append("svg");

  svg
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height].join(" "));

  function gradientId(link: { id: string }) {
    return `gradient-${link.id}`;
  }

  const defsElement = svg.append("defs");

  const filterElement = defsElement
    .append("filter")
    .attr("id", "shadow")
    .attr("color-interpolation-filters", "sRGB");
  filterElement
    .append("feDropShadow")
    .attr("dx", 0)
    .attr("dy", 0)
    .attr("stdDeviation", 3)
    .attr("flood-opacity", 0.5);

  const gradientElements = defsElement
    .selectAll("linearGradient")
    .data(links)
    .join("linearGradient")
    .attr("id", gradientId)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", ({source, target}) => {
      return (
        radius *
        Math.cos(clusterLayoutLeavesByPath.get(source)?.x - Math.PI / 2)
      );
    })
    .attr(
      "y1",
      ({source}) =>
        radius *
        Math.sin(clusterLayoutLeavesByPath.get(source)?.y - Math.PI / 2),
    )
    .attr(
      "x2",
      ({target}) =>
        radius *
        Math.cos(clusterLayoutLeavesByPath.get(target)?.x - Math.PI / 2),
    )
    .attr(
      "y2",
      ({target}) =>
        radius *
        Math.sin(clusterLayoutLeavesByPath.get(target)?.y - Math.PI / 2),
    );

  gradientElements
    .append("stop")
    .attr("offset", "0%")
    .attr(
      "stop-color",
      ({source}) =>
        clusterLayoutLeavesByPath.get(source) &&
        color(clusterLayoutLeavesByPath.get(source)),
    );
  gradientElements
    .append("stop")
    .attr("offset", "100%")
    .attr(
      "stop-color",
      ({target}) =>
        clusterLayoutLeavesByPath.get(target) &&
        color(clusterLayoutLeavesByPath.get(target)),
    );
  defsElement.append("style").text(css);

  const nodesElement = svg.append("g").classed("nodes", true);
  const linksElement = svg.append("g").classed("links", true);
  const legendElement = svg.append("g").classed("legend", true);
  legendElement.append("g").classed("ring", true);
  legendElement.append("g").classed("chords", true);
  legendElement.append("g").classed("labels", true);

  const nodeElements = nodesElement
    .selectAll("g")
    .data(clusterLayout.leaves())
    .join("g")
    .classed("node", true)
    .attr(
      "transform",
      (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`,
    )
    .attr("fill-opacity", (d) =>
      filter === "" || activeElements.has(d.data.path) ? 1 : 0.1,
    )
    .attr("fill", (d) =>
      filter === "" || activeElements.has(d.data.path) ? color(d) : "#f0f0f0",
    );

  const nodeElementsText = nodeElements
    .append("text")
    .attr("x", (d) =>
      d.x < Math.PI ? baselineHeight / 2 : -baselineHeight / 2,
    )
    .attr("text-anchor", ({x}) => (x < Math.PI ? "start" : "end"))
    .attr("transform", ({x}) => (x >= Math.PI ? "rotate(180)" : null))
    .attr("fill", color);

  nodeElementsText
    .append("tspan")
    .text((d: HierarchyPointNode<ResearchAgendaItem>) => (d.x <= Math.PI) ? d.data.group || "" : d.data.label)
    .classed("group", ({x}) => x <= Math.PI)
    .on("mouseover", (_, d) => {
      filter =
        (d.x <= Math.PI
          ? d.data.ancestors?.slice(1).reverse().join(".")
          : d.data.ancestors?.slice(0).reverse().join(".")) || "";
    });
  nodeElementsText
    .append("tspan")
    .text((d) =>
      d.x >= Math.PI ? nameFixer(d.data.group) : nameFixer(d.data.label),
    )
    // .classed('bold', ({ x }) => x > Math.PI)
    .attr("dx", 7)
    .on("mouseover", (_, d) => {
      filter =
        (d.x > Math.PI
          ? d.data.ancestors?.slice(1).reverse().join(".")
          : d.data.ancestors?.slice(0).reverse().join(".")) || "";
    });

  const linkElements = linksElement
    .selectAll("path.link")
    .data(links)
    .join("path")
    // .style('stroke', (d) => 'black')
    .style("stroke", (d) => {
      return `url(#${gradientId(d)})`;
    })
    .classed("link", true)
    .attr("stroke-width", ({source, target}) =>
      filter === "" ||
      (activeElements.has(source) && activeElements.has(target))
        ? 3
        : 3,
    )
    .attr("stroke-opacity", ({source, target}) =>
      filter === "" ||
      (activeElements.has(source) && activeElements.has(target))
        ? 0.3
        : 0.0,
    )
    .attr("d", (d) => {
      return ribbon()({
        source: {
          startAngle: clusterLayoutLeavesByPath.get(d.source)?.x - dTheta,
          endAngle: clusterLayoutLeavesByPath.get(d.source)?.x + dTheta,
          radius: clusterLayoutLeavesByPath.get(d.source)?.y,
        },
        target: {
          startAngle: clusterLayoutLeavesByPath.get(d.target)?.x - dTheta,
          endAngle: clusterLayoutLeavesByPath.get(d.target)?.x + dTheta,
          radius: clusterLayoutLeavesByPath.get(d.source)?.y,
        },
      });
    });

  const objectiveNodes = clusterLayout
    .leaves()
    .filter((d) => d.data.path?.startsWith("agenda.objectives"));

  const facilityNodes = clusterLayout
    .leaves()
    .filter((d) => d.data.path?.startsWith("agenda.facilities"));

  const topicsNodes = clusterLayout
    .leaves()
    .filter((d) => d.data.path?.startsWith("agenda.topics"));

  const legendData = [
    {
      level: 0,
      height: 1,
      name: "Ziele",
      color: green,
      startAngle: Math.min(...objectiveNodes.map(({x}) => x)),
      endAngle: Math.max(...objectiveNodes.map(({x}) => x)),
    },
    {
      level: 0,
      height: 1,
      name: "Anlagen",
      color: blue,
      label: "Anlagen",
      startAngle: Math.min(...facilityNodes.map(({x}) => x)),
      endAngle: Math.max(...facilityNodes.map(({x}) => x)),
    },
    {
      level: 0,
      height: 1,
      name: "Themen",
      color: red,
      startAngle: Math.min(...topicsNodes.map(({x}) => x)),
      endAngle: Math.max(...topicsNodes.map(({x}) => x)),
      innerRadius: radius - baselineHeight,
      outerRadius: radius + baselineHeight,
    },
  ];

  svg
    .select("g.legend g.ring")
    .selectAll("path.legend")
    .data(legendData)
    .join("path")
    .classed("legend", true)
    .attr("filter", "url(#shadow)")
    .attr("id", ({name}) => name)
    .attr("fill", ({color}) => `${color}`)
    .attr("fill-opacity", 0.95)
    .datum(({startAngle, endAngle, level, height}) => ({
      startAngle: startAngle - 0.05,
      endAngle: endAngle + 0.05,
      innerRadius: radius + (level - 1) * baselineHeight,
      outerRadius: radius + (level - 1 + height) * baselineHeight,
    }))
    .attr("stroke", "white")
    .attr("d", arc());

  svg
    .select("g.legend g.labels")
    .selectAll("text")
    .data(legendData)
    .join("text")
    .attr("dx", 10)
    .attr("dy", 8)
    .append("textPath")
    .attr("fill", "white")
    .attr("href", ({name}) => `#${name}`)
    .text(({name}) => name);

  // updateFilter(nodeElements);

  return document.body.innerHTML;
};

function updateFilter(nodeElements: any) {
  // links.forEach((link) => {
  //   if (link.source.data.path.includes(filter)) {
  //     activeElements.add(link.id);
  //     activeElements.add(link.target.data.id);
  //   }
  // });
  nodeElements
    .attr("fill-opacity", (d: ResearchAgendaItemHierarchyNode) =>
      filter === "" || activeElements.has(d.data.path) ? 1 : 0.1,
    )
    .attr("fill", (d: ResearchAgendaItemHierarchyNode) =>
      filter === "" || activeElements.has(d.data.path) ? color(d) : "#f0f0f0",
    );

  // nodeElements
  //   .selectAll("tspan")
  //   .attr("filter", (d) =>
  //     filter !== "" && d.data.path.includes(filter)
  //       ? "url(#glow)"
  //       : "",
  //   );

  linkElements
    .attr("stroke-width", ({path = ""}) =>
      filter === "" || activeElements.has(path) ? 3 : 3,
    )
    .attr("stroke-opacity", ({id = ""}) =>
      filter === "" || activeElements.has(id) ? 0.3 : 0.0,
    )
    .style("stroke", ({id = ""}) =>
      filter === "" || activeElements.has(id)
        ? `url(#${gradientId({id})})`
        : "#999999",
    );
}

// const item = researchAgenda.find((item) => item.name === filter)
