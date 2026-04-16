import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Search,
  Plus,
  Camera,
  Trash2,
  EyeOff,
  Eye,
  Upload,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const divisions = [
  "Electrical",
  "Programming",
  "Mechanical",
  "Business",
  "Tools",
  "Battery Data",
];

const initialItems = [
  {
    id: "ELE-001",
    name: "Kraken Motor",
    division: "Electrical",
    subSection: "Motors",
    quantity: 8,
    onRobot: 4,
    minStock: 4,
    status: "In Stock",
    notes: "Main drive motors.",
    image:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80",
    showOnRobot: true,
  },
  {
    id: "ELE-002",
    name: "Competition Battery",
    division: "Electrical",
    subSection: "Power",
    quantity: 6,
    onRobot: 1,
    minStock: 4,
    status: "Needs Review",
    notes: "Track battery health before comps.",
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80",
    showOnRobot: true,
  },
  {
    id: "PRO-001",
    name: "Driver Station Laptop",
    division: "Programming",
    subSection: "Devices",
    quantity: 2,
    onRobot: 0,
    minStock: 1,
    status: "In Stock",
    notes: "Keep charger with laptop.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    showOnRobot: false,
  },
  {
    id: "MEC-001",
    name: "10-32 Bolt Pack",
    division: "Mechanical",
    subSection: "Hardware",
    quantity: 34,
    onRobot: 12,
    minStock: 15,
    status: "In Stock",
    notes: "Restock before event travel.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
    showOnRobot: true,
  },
  {
    id: "BUS-001",
    name: "Sponsor Banner",
    division: "Business",
    subSection: "Outreach",
    quantity: 3,
    onRobot: 0,
    minStock: 1,
    status: "In Stock",
    notes: "Use for demos and events.",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
    showOnRobot: false,
  },
];

const defaultStatuses = ["In Stock", "Needs Review", "Broken", "Ordered"];

const defaultSubSections = {
  Electrical: ["Motors", "Power", "Controllers", "Sensors", "Wiring"],
  Programming: ["Devices", "Controllers", "Code Tools", "Vision"],
  Mechanical: ["Hardware", "Tools", "Drivetrain", "Structure"],
  Business: ["Outreach", "Media", "Fundraising", "Team Supplies"],
  Tools: ["Hand Tools", "Power Tools", "Pit Tools", "Electrical Tools"],
  "Battery Data": ["Competition Batteries", "Practice Batteries"],
};

const defaultColors = {
  primary: "#0f172a",
  secondary: "#e2e8f0",
  accent: "#2563eb",
  page: "#f8fafc",
};

// ─── InventoryCard ─────────────────────────────────────────────────────────────

function InventoryCard({
  item,
  onDelete,
  onUpdateCount,
  onToggleOnRobotVisibility,
  teamColors,
}) {
  const lowStock = Number(item.quantity) <= Number(item.minStock);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card
        className="relative overflow-hidden rounded-2xl bg-white shadow-sm"
        style={{ borderColor: teamColors.secondary }}
      >
        <CardContent className="p-4">
          {/* Toggle on-robot visibility */}
          <div className="absolute left-2 top-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleOnRobotVisibility(item.id)}
              className="h-8 w-8"
            >
              {item.showOnRobot ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Delete button */}
          <div className="absolute right-2 top-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Image */}
            <div className="h-36 w-36 overflow-hidden rounded-2xl bg-slate-100">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <Camera className="h-8 w-8" />
                </div>
              )}
            </div>

            <div className="mt-4 w-full space-y-3">
              {/* Name + low-stock badge */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: teamColors.primary }}
                >
                  {item.name}
                </h3>
                {lowStock && <Badge>Low Stock</Badge>}
              </div>

              {/* ID + status badges */}
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">{item.id}</Badge>
                <Badge variant="outline">{item.status}</Badge>
              </div>

              <p className="text-sm text-slate-500">
                {item.division} • {item.subSection}
              </p>

              {/* Quantity controls */}
              <div
                className={`grid gap-3 ${
                  item.showOnRobot ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    We Have
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onUpdateCount(
                          item.id,
                          "quantity",
                          Number(item.quantity) - 1
                        )
                      }
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateCount(item.id, "quantity", e.target.value)
                      }
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onUpdateCount(
                          item.id,
                          "quantity",
                          Number(item.quantity) + 1
                        )
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>

                {item.showOnRobot && (
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      On Robot
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onUpdateCount(
                            item.id,
                            "onRobot",
                            Number(item.onRobot) - 1
                          )
                        }
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        value={item.onRobot}
                        onChange={(e) =>
                          onUpdateCount(item.id, "onRobot", e.target.value)
                        }
                        className="w-20 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onUpdateCount(
                            item.id,
                            "onRobot",
                            Number(item.onRobot) + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {item.notes ? (
                <p className="text-sm text-slate-600">{item.notes}</p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── BatteryDataPanel ──────────────────────────────────────────────────────────

function BatteryDataPanel({
  batteries,
  setBatteries,
  teamColors,
  batterySubSections,
  addBatterySubSection,
  deleteBatterySubSection,
}) {
  const [newBattery, setNewBattery] = useState({
    label: "",
    year: "",
    ah: 12.0,
    subSection: batterySubSections[0] || "General",
  });
  const [newBatterySubSection, setNewBatterySubSection] = useState("");

  const addBattery = () => {
    const cleanedLabel = newBattery.label.trim();
    const cleanedYear = newBattery.year.trim();
    const cleanedSubSection = (newBattery.subSection || "").trim();
    if (!cleanedLabel || !cleanedSubSection) return;

    setBatteries((current) => [
      ...current,
      {
        id: `${cleanedLabel}-${Date.now()}`,
        label: cleanedLabel,
        year: cleanedYear,
        ah: Number(newBattery.ah) || 0,
        subSection: cleanedSubSection,
      },
    ]);

    setNewBattery((current) => ({
      ...current,
      label: "",
      year: "",
      ah: 12.0,
    }));
  };

  const updateBattery = (id, field, value) => {
    setBatteries((current) =>
      current.map((battery) => {
        if (battery.id !== id) return battery;
        return {
          ...battery,
          [field]:
            field === "label" || field === "year" || field === "subSection"
              ? value
              : Number(value) || 0,
        };
      })
    );
  };

  const retireBattery = (id) => {
    setBatteries((current) =>
      current.filter((battery) => battery.id !== id)
    );
  };

  const groupedBatteries = batterySubSections.map((section) => ({
    section,
    batteries: batteries.filter(
      (battery) => (battery.subSection || "General") === section
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Action row */}
      <div className="flex justify-end gap-2 mt-16">
        {/* Add Battery dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="rounded-xl"
              style={{ backgroundColor: teamColors.accent, color: "white" }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Battery
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add Battery</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Battery Name</Label>
                <Input
                  value={newBattery.label}
                  onChange={(e) =>
                    setNewBattery((c) => ({ ...c, label: e.target.value }))
                  }
                  placeholder="Battery 7"
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  value={newBattery.year}
                  onChange={(e) =>
                    setNewBattery((c) => ({ ...c, year: e.target.value }))
                  }
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Amp Hours (AH)</Label>
                <Input
                  type="number"
                  value={newBattery.ah}
                  onChange={(e) =>
                    setNewBattery((c) => ({ ...c, ah: e.target.value }))
                  }
                  placeholder="12.0"
                />
              </div>
              <div className="space-y-2">
                <Label>Subsystem</Label>
                <Select
                  value={newBattery.subSection}
                  onValueChange={(value) =>
                    setNewBattery((c) => ({ ...c, subSection: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {batterySubSections.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={addBattery}>Save Battery</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Battery subsections management */}
      <Card
        className="rounded-2xl shadow-sm"
        style={{ borderColor: teamColors.secondary }}
      >
        <CardHeader>
          <CardTitle style={{ color: teamColors.primary }}>
            Battery Subsystems
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="rounded-xl"
                  style={{ backgroundColor: teamColors.accent, color: "white" }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Battery Subsystem
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Add Battery Subsystem</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input
                    value={newBatterySubSection}
                    onChange={(e) => setNewBatterySubSection(e.target.value)}
                    placeholder="e.g. Competition, Practice, Testing"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        const cleaned = newBatterySubSection.trim();
                        if (!cleaned) return;
                        addBatterySubSection(cleaned);
                        setNewBattery((c) => ({ ...c, subSection: cleaned }));
                        setNewBatterySubSection("");
                      }}
                    >
                      Save Subsystem
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-wrap gap-2">
            {batterySubSections.map((section) => (
              <div
                key={section}
                className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1"
              >
                <Badge variant="secondary">{section}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => deleteBatterySubSection(section)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Battery rows grouped by subsystem */}
      {groupedBatteries.map(({ section, batteries: sectionBatteries }) => (
        <Card
          key={section}
          className="rounded-2xl shadow-sm"
          style={{ borderColor: teamColors.secondary }}
        >
          <CardHeader>
            <CardTitle style={{ color: teamColors.primary }}>{section}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sectionBatteries.length > 0 ? (
              sectionBatteries.map((battery) => {
                const isGood = Number(battery.ah) >= 14.75;
                return (
                  <div key={battery.id} className="rounded-2xl border p-4">
                    <div className="flex items-center gap-3">
                      <Input
                        value={battery.label}
                        onChange={(e) =>
                          updateBattery(battery.id, "label", e.target.value)
                        }
                        placeholder="Battery Name"
                        className="flex-1"
                      />
                      <Input
                        value={battery.year || ""}
                        onChange={(e) =>
                          updateBattery(battery.id, "year", e.target.value)
                        }
                        placeholder="Year"
                        className="w-28"
                      />
                      <div
                        className={`h-6 w-2 rounded-full ${
                          isGood ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <Input
                        type="number"
                        value={battery.ah}
                        onChange={(e) =>
                          updateBattery(battery.id, "ah", e.target.value)
                        }
                        placeholder="AH"
                        className="w-32"
                      />
                      <Select
                        value={battery.subSection || section}
                        onValueChange={(value) =>
                          updateBattery(battery.id, "subSection", value)
                        }
                      >
                        <SelectTrigger className="w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {batterySubSections.map((subSection) => (
                            <SelectItem key={subSection} value={subSection}>
                              {subSection}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => retireBattery(battery.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Retire Battery
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500">
                No batteries in this subsystem.
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function RoboticsInventoryWebsite() {
  const [teamColors, setTeamColors] = useState(defaultColors);
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [activeDivision, setActiveDivision] = useState(divisions[0]);
  const [subSectionsByDivision, setSubSectionsByDivision] =
    useState(defaultSubSections);
  const [statuses, setStatuses] = useState(defaultStatuses);
  const [shippingOrders, setShippingOrders] = useState([]);
  const [newSubSection, setNewSubSection] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newItem, setNewItem] = useState({
    id: "",
    name: "",
    division: divisions[0],
    subSection: defaultSubSections[divisions[0]][0],
    quantity: 1,
    onRobot: 0,
    minStock: 1,
    status: defaultStatuses[0],
    notes: "",
    image: "",
    showOnRobot: true,
  });
  const [batteries, setBatteries] = useState([
    {
      id: "BAT-1",
      label: "Battery 1",
      year: "2024",
      ah: 12.8,
      subSection: "Competition Batteries",
    },
    {
      id: "BAT-2",
      label: "Battery 2",
      year: "2023",
      ah: 12.3,
      subSection: "Practice Batteries",
    },
    {
      id: "BAT-3",
      label: "Battery 3",
      year: "2022",
      ah: 11.9,
      subSection: "Practice Batteries",
    },
  ]);

  const batterySubSections =
    subSectionsByDivision["Battery Data"] ||
    defaultSubSections["Battery Data"] ||
    ["General"];

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return items.filter((item) => {
      if (item.division !== activeDivision) return false;
      const searchableText = [
        item.name,
        item.id,
        item.division,
        item.subSection,
        item.status,
        item.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchableText.includes(normalizedSearch);
    });
  }, [items, search, activeDivision]);

  const lowStockItems = useMemo(() => {
    return items.filter(
      (item) => Number(item.quantity) <= Number(item.minStock)
    );
  }, [items]);

  const currentSubSections = useMemo(() => {
    const saved = subSectionsByDivision[activeDivision] || [];
    const used = filteredItems.map((item) => item.subSection).filter(Boolean);
    return Array.from(new Set([...saved, ...used]));
  }, [subSectionsByDivision, activeDivision, filteredItems]);

  const groupedSections = useMemo(() => {
    return currentSubSections.map((section) => ({
      section,
      items: filteredItems.filter((item) => item.subSection === section),
    }));
  }, [currentSubSections, filteredItems]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const deleteItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const updateCount = (id, field, value) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const parsed = Number(value);
        const nextValue = Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;

        if (field === "quantity") {
          return {
            ...item,
            quantity: nextValue,
            onRobot: Math.min(Number(item.onRobot), nextValue),
          };
        }

        if (field === "onRobot") {
          return {
            ...item,
            onRobot: item.showOnRobot
              ? Math.min(nextValue, Number(item.quantity))
              : 0,
          };
        }

        return item;
      })
    );
  };

  const toggleOnRobotVisibility = (id) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const nextShow = !item.showOnRobot;
        return {
          ...item,
          showOnRobot: nextShow,
          onRobot: nextShow
            ? Math.min(Number(item.onRobot), Number(item.quantity))
            : 0,
        };
      })
    );
  };

  const addItem = () => {
    const cleanedId = newItem.id.trim();
    const cleanedName = newItem.name.trim();
    const cleanedNotes = newItem.notes.trim();
    const cleanedImage = newItem.image.trim();
    const cleanedSubSection = newItem.subSection.trim();

    if (!cleanedId || !cleanedName || !cleanedSubSection) return;
    if (
      items.some(
        (item) => item.id.toLowerCase() === cleanedId.toLowerCase()
      )
    )
      return;

    const quantity = Math.max(Number(newItem.quantity) || 0, 0);
    const minStock = Math.max(Number(newItem.minStock) || 0, 0);
    const onRobot = newItem.showOnRobot
      ? Math.min(Math.max(Number(newItem.onRobot) || 0, 0), quantity)
      : 0;

    setItems((current) => [
      {
        id: cleanedId,
        name: cleanedName,
        division: newItem.division,
        subSection: cleanedSubSection,
        quantity,
        onRobot,
        minStock,
        status: newItem.status,
        notes: cleanedNotes,
        image: cleanedImage,
        showOnRobot: newItem.showOnRobot,
      },
      ...current,
    ]);

    setSubSectionsByDivision((current) => {
      const currentList = current[newItem.division] || [];
      if (
        currentList.some(
          (section) =>
            section.toLowerCase() === cleanedSubSection.toLowerCase()
        )
      )
        return current;
      return {
        ...current,
        [newItem.division]: [...currentList, cleanedSubSection],
      };
    });

    setNewItem((current) => ({
      ...current,
      id: "",
      name: "",
      quantity: 1,
      onRobot: 0,
      minStock: 1,
      notes: "",
      image: "",
      showOnRobot: true,
    }));
  };

  const addSubSection = () => {
    const cleaned = newSubSection.trim();
    if (!cleaned || activeDivision === "Battery Data") return;

    setSubSectionsByDivision((current) => {
      const currentList = current[activeDivision] || [];
      if (
        currentList.some(
          (section) => section.toLowerCase() === cleaned.toLowerCase()
        )
      )
        return current;
      return {
        ...current,
        [activeDivision]: [...currentList, cleaned],
      };
    });

    setNewSubSection("");
    setNewItem((current) => {
      if (current.division !== activeDivision) return current;
      return { ...current, subSection: cleaned };
    });
  };

  const deleteSubSection = (sectionName) => {
    if (activeDivision === "Battery Data") return;

    const remainingSections = (
      subSectionsByDivision[activeDivision] || []
    ).filter((s) => s !== sectionName);

    setSubSectionsByDivision((current) => {
      const currentList = current[activeDivision] || [];
      return {
        ...current,
        [activeDivision]: currentList.filter((s) => s !== sectionName),
      };
    });

    setItems((current) =>
      current.filter(
        (item) =>
          !(
            item.division === activeDivision &&
            item.subSection === sectionName
          )
      )
    );

    setNewItem((current) => {
      if (
        current.division !== activeDivision ||
        current.subSection !== sectionName
      )
        return current;
      return {
        ...current,
        subSection: remainingSections[0] || "General",
      };
    });
  };

  const addStatus = () => {
    const cleaned = newStatus.trim();
    if (
      !cleaned ||
      statuses.some(
        (status) => status.toLowerCase() === cleaned.toLowerCase()
      )
    )
      return;
    setStatuses((current) => [...current, cleaned]);
    setNewStatus("");
    setNewItem((current) => ({ ...current, status: cleaned }));
  };

  const handleShippingUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const uploaded = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toLocaleString(),
    }));

    setShippingOrders((current) => [...uploaded, ...current]);
    event.target.value = "";
  };

  const handleItemImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setNewItem((current) => ({ ...current, image: objectUrl }));
    event.target.value = "";
  };

  const addBatterySubSection = (name) => {
    const cleaned = name.trim();
    if (!cleaned) return;

    setSubSectionsByDivision((current) => {
      const currentList = current["Battery Data"] || [];
      if (
        currentList.some(
          (section) => section.toLowerCase() === cleaned.toLowerCase()
        )
      )
        return current;
      return {
        ...current,
        "Battery Data": [...currentList, cleaned],
      };
    });
  };

  const deleteBatterySubSection = (sectionName) => {
    const remainingSections = batterySubSections.filter(
      (section) => section !== sectionName
    );
    if (remainingSections.length === 0) return;

    setSubSectionsByDivision((current) => ({
      ...current,
      "Battery Data": remainingSections,
    }));

    setBatteries((current) =>
      current.filter((battery) => battery.subSection !== sectionName)
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ backgroundColor: teamColors.page }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border p-6 shadow-sm"
          style={{ backgroundColor: "white", borderColor: teamColors.secondary }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="rounded-2xl p-3"
                style={{ backgroundColor: teamColors.secondary }}
              >
                <Package
                  className="h-6 w-6"
                  style={{ color: teamColors.primary }}
                />
              </div>
              <div>
                <h1
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: teamColors.primary }}
                >
                  Robotics Inventory
                </h1>
                <p className="text-sm text-slate-500">
                  Simple, easy inventory for a robotics team.
                </p>
              </div>
            </div>

            {/* Add Item dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="rounded-2xl"
                  style={{ backgroundColor: teamColors.accent, color: "white" }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-3xl rounded-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Inventory Item</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-2 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Item ID</Label>
                    <Input
                      value={newItem.id}
                      onChange={(e) =>
                        setNewItem((c) => ({ ...c, id: e.target.value }))
                      }
                      placeholder="ELE-101"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Input
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem((c) => ({ ...c, name: e.target.value }))
                      }
                      placeholder="Battery"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Team Tab</Label>
                    <Select
                      value={newItem.division}
                      onValueChange={(value) => {
                        const nextSections =
                          subSectionsByDivision[value] ||
                          defaultSubSections[value] ||
                          ["General"];
                        setNewItem((c) => ({
                          ...c,
                          division: value,
                          subSection: nextSections[0] || "General",
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {divisions.map((division) => (
                          <SelectItem key={division} value={division}>
                            {division}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sub Section</Label>
                    <Select
                      value={newItem.subSection}
                      onValueChange={(value) =>
                        setNewItem((c) => ({ ...c, subSection: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          subSectionsByDivision[newItem.division] ||
                          defaultSubSections[newItem.division] ||
                          ["General"]
                        ).map((section) => (
                          <SelectItem key={section} value={section}>
                            {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={newItem.status}
                      onValueChange={(value) =>
                        setNewItem((c) => ({ ...c, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Total Quantity</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem((c) => ({ ...c, quantity: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Show On Robot for This Item</Label>
                      <Switch
                        checked={newItem.showOnRobot}
                        onCheckedChange={(checked) =>
                          setNewItem((c) => ({
                            ...c,
                            showOnRobot: checked,
                            onRobot: checked ? c.onRobot : 0,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {newItem.showOnRobot && (
                    <div className="space-y-2">
                      <Label>How Many Are On the Robot</Label>
                      <Input
                        type="number"
                        min="0"
                        value={newItem.onRobot}
                        onChange={(e) =>
                          setNewItem((c) => ({
                            ...c,
                            onRobot: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Low Stock Alert Number</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newItem.minStock}
                      onChange={(e) =>
                        setNewItem((c) => ({
                          ...c,
                          minStock: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label>Product Image</Label>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <Label className="inline-flex w-fit cursor-pointer items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                        <Upload className="mr-2 h-4 w-4" /> Upload Image
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleItemImageUpload}
                        />
                      </Label>
                      <Input
                        value={newItem.image}
                        onChange={(e) =>
                          setNewItem((c) => ({ ...c, image: e.target.value }))
                        }
                        placeholder="Or paste an image link here"
                      />
                    </div>
                    {newItem.image ? (
                      <div className="h-28 w-28 overflow-hidden rounded-2xl border bg-slate-50">
                        <img
                          src={newItem.image}
                          alt="New item preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={newItem.notes}
                      onChange={(e) =>
                        setNewItem((c) => ({ ...c, notes: e.target.value }))
                      }
                      placeholder="Anything the team should know."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={addItem} className="min-w-32">
                    Save Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Division tabs */}
        <Tabs
          value={activeDivision}
          onValueChange={setActiveDivision}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3 gap-2 rounded-2xl bg-transparent p-0 md:grid-cols-6">
            {divisions.map((division) => (
              <TabsTrigger
                key={division}
                value={division}
                className="rounded-2xl border bg-white"
                style={{
                  borderColor: teamColors.secondary,
                  color: teamColors.primary,
                }}
              >
                {division}
              </TabsTrigger>
            ))}
          </TabsList>

          {divisions.map((division) => (
            <TabsContent
              key={division}
              value={division}
              className="space-y-4"
            >
              {division === "Battery Data" ? (
                <BatteryDataPanel
                  batteries={batteries}
                  setBatteries={setBatteries}
                  teamColors={teamColors}
                  batterySubSections={batterySubSections}
                  addBatterySubSection={addBatterySubSection}
                  deleteBatterySubSection={deleteBatterySubSection}
                />
              ) : (
                <>
                  {/* Search bar */}
                  <Card
                    className="mt-10 rounded-2xl shadow-sm"
                    style={{ borderColor: teamColors.secondary }}
                  >
                    <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder={`Search ${division.toLowerCase()} items`}
                          className="pl-9"
                        />
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {filteredItems.length} items
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* Items grouped by subsection */}
                  <div className="space-y-6">
                    {groupedSections.map(
                      ({ section, items: sectionItems }) => (
                        <div key={section} className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <h2 className="text-xl font-semibold text-slate-900">
                                {section}
                              </h2>
                              <Badge variant="outline">
                                {sectionItems.length}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSubSection(section)}
                              className="h-8 px-2 text-xs"
                            >
                              <Trash2 className="mr-1 h-4 w-4" /> Delete
                              Section
                            </Button>
                          </div>

                          {sectionItems.length > 0 ? (
                            <div className="grid justify-center gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,240px))]">
                              {sectionItems.map((item) => (
                                <InventoryCard
                                  key={item.id}
                                  item={item}
                                  onDelete={deleteItem}
                                  onUpdateCount={updateCount}
                                  onToggleOnRobotVisibility={
                                    toggleOnRobotVisibility
                                  }
                                  teamColors={teamColors}
                                />
                              ))}
                            </div>
                          ) : (
                            <Card className="rounded-2xl border-dashed shadow-sm">
                              <CardContent className="p-6 text-center text-slate-500">
                                No items in this sub section.
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom tabs: Alerts / Shipping / Settings */}
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl">
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Orders</TabsTrigger>
            <TabsTrigger value="settings">Customize</TabsTrigger>
          </TabsList>

          {/* Alerts tab */}
          <TabsContent value="alerts">
            <Card
              className="rounded-2xl shadow-sm"
              style={{ borderColor: teamColors.secondary }}
            >
              <CardHeader>
                <CardTitle style={{ color: teamColors.primary }}>
                  Low Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.id} • {item.division} • {item.subSection}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Qty: {item.quantity}</Badge>
                        <Badge variant="secondary">
                          Alert At: {item.minStock}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Everything is above the alert level right now.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping tab */}
          <TabsContent value="shipping" className="space-y-4">
            <Card
              className="rounded-2xl shadow-sm"
              style={{ borderColor: teamColors.secondary }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2"
                  style={{ color: teamColors.primary }}
                >
                  <Upload className="h-5 w-5" /> Shipping Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-dashed p-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        Upload a shipping order
                      </p>
                      <p className="text-sm text-slate-500">
                        Add PDFs, screenshots, or order files here so your team
                        can keep track of incoming parts.
                      </p>
                    </div>
                    <Label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                      <Upload className="mr-2 h-4 w-4" /> Choose Files
                      <Input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleShippingUpload}
                      />
                    </Label>
                  </div>
                </div>

                {shippingOrders.length > 0 ? (
                  <div className="space-y-3">
                    {shippingOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col gap-2 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {order.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            Uploaded {order.uploadedAt}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {Math.max(1, Math.round(order.size / 1024))} KB
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No shipping orders uploaded yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customize tab */}
          <TabsContent value="settings" className="space-y-4">
            {/* Team colors */}
            <Card
              className="rounded-2xl shadow-sm"
              style={{ borderColor: teamColors.secondary }}
            >
              <CardHeader>
                <CardTitle style={{ color: teamColors.primary }}>
                  Team Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Primary (text / icons)", key: "primary" },
                  { label: "Secondary (borders / bg)", key: "secondary" },
                  { label: "Accent (buttons)", key: "accent" },
                  { label: "Page background", key: "page" },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={teamColors[key]}
                      onChange={(e) =>
                        setTeamColors((c) => ({ ...c, [key]: e.target.value }))
                      }
                      className="h-10 w-10 cursor-pointer rounded-lg border"
                    />
                    <Label>{label}</Label>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="md:col-span-2 w-fit"
                  onClick={() => setTeamColors(defaultColors)}
                >
                  Reset to defaults
                </Button>
              </CardContent>
            </Card>

            {/* Manage subsections */}
            {activeDivision !== "Battery Data" && (
              <Card
                className="rounded-2xl shadow-sm"
                style={{ borderColor: teamColors.secondary }}
              >
                <CardHeader>
                  <CardTitle style={{ color: teamColors.primary }}>
                    Subsections — {activeDivision}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newSubSection}
                      onChange={(e) => setNewSubSection(e.target.value)}
                      placeholder="New subsection name"
                    />
                    <Button onClick={addSubSection}>
                      <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(subSectionsByDivision[activeDivision] || []).map(
                      (section) => (
                        <div
                          key={section}
                          className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1"
                        >
                          <Badge variant="secondary">{section}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => deleteSubSection(section)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Manage statuses */}
            <Card
              className="rounded-2xl shadow-sm"
              style={{ borderColor: teamColors.secondary }}
            >
              <CardHeader>
                <CardTitle style={{ color: teamColors.primary }}>
                  Item Statuses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    placeholder="New status label"
                  />
                  <Button onClick={addStatus}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Badge key={status} variant="outline">
                      {status}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
