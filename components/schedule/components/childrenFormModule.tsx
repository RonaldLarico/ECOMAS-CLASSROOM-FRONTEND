import {
  CorporationAllList,
  GraduateAllListSearch,
} from "@/actions/ADMIN/getRoutes";
import { GraduateList } from "@/actions/ADMIN/interface/interface";
import React, { Component } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import Cookies from "js-cookie";
import { ChildFormProps, ChildrenFormModuleState } from "./interface/interface";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
class ChildrenFormModule extends Component<
  ChildFormProps & { onCorporationsChange: (ids: number[]) => void },
  ChildrenFormModuleState
> {
  constructor(
    props: ChildFormProps & { onCorporationsChange: (ids: number[]) => void }
  ) {
    super(props);
    this.state = {
      searchTerm: "",
      graduates: [],
      selectedGraduate: null,
      loading: false,
      cache: {},
      corporations: [],
      selectedCorporations: [],
    };
  }

  componentDidMount() {
    this.fetchCorporations();
    this.fetchAllGraduates();
  }

  fetchAllGraduates = async () => {
    const token = Cookies.get("token");

    if (!token) {
      console.error("Token no encontrado en las cookies");
      return;
    }

    this.setState({ loading: true });
    try {
      const result = await GraduateAllListSearch({ search: "", token });
      this.setState({
        graduates: result,
        cache: { all: result },
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching graduates:", error);
      this.setState({ loading: false });
    }
  };

  handleInputChange = (value: string) => {
    this.setState({ searchTerm: value }, () => {
      if (value.trim()) {
        this.fetchGraduates();
      } else {
        this.setState({ graduates: this.state.cache["all"] || [] });
      }
    });
  };

  fetchGraduates = async () => {
    const { searchTerm, cache } = this.state;
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado en las cookies");
      return;
    }
    if (cache[searchTerm]) {
      this.setState({ graduates: cache[searchTerm] });
      return;
    }

    this.setState({ loading: true });
    try {
      const result = await GraduateAllListSearch({ search: searchTerm, token });
      this.setState((prevState) => ({
        graduates: result,
        cache: { ...prevState.cache, [searchTerm]: result },
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching graduates:", error);
      this.setState({ loading: false });
    }
  };

  fetchCorporations = async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado en las cookies");
      return;
    }
    try {
      const result = await CorporationAllList({ token });
      const allCorpIds = result.map((corp) => corp.id);
      this.setState(
        {
          corporations: result,
          selectedCorporations: allCorpIds,
        },
        () => {
          this.props.onCorporationsChange(allCorpIds);
        }
      );
    } catch (error) {
      console.error("Error fetching corporations:", error);
    }
  };

  handleSelectGraduate = (grad: GraduateList, field: any) => {
    this.setState({
      selectedGraduate: grad,
      searchTerm: grad.name,
    });
    field.onChange(grad.id);
  };

  handleSelectAll = (checked: boolean) => {
    const { corporations } = this.state;
    setTimeout(() => {
      if (checked) {
        const allCorpIds = corporations.map((corp) => corp.id);
        this.setState({ selectedCorporations: allCorpIds }, () => {
          this.props.onCorporationsChange(this.state.selectedCorporations);
        });
      } else {
        this.setState({ selectedCorporations: [] }, () => {
          this.props.onCorporationsChange(this.state.selectedCorporations);
        });
      }
    }, 0);
  };

  handleCorporationSelect = (corpId: number, checked: boolean) => {
    setTimeout(() => {
      const { selectedCorporations } = this.state;
      const newSelectedCorporations = checked
        ? [...selectedCorporations, corpId]
        : selectedCorporations.filter((id) => id !== corpId);

      this.setState({ selectedCorporations: newSelectedCorporations }, () => {
        this.props.onCorporationsChange(newSelectedCorporations);
      });
    }, 0);
  };

  render() {
    const { control } = this.props;
    const { graduates, loading, corporations, selectedCorporations } =
      this.state;
    const allSelected = selectedCorporations.length === corporations.length;

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <FormField
          control={control}
          name="graduateId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel> Seleccionar Diplomado</FormLabel>
              <FormControl>
                <ScrollArea>
                <Combobox
                  options={
                    graduates && graduates.length > 0
                      ? graduates.map((grad) => ({
                          value: grad.name,
                          label: grad.name,
                        }))
                      : []
                  }
                  placeholder="Buscar Diplomado ..."
                  onSelect={(selectedValue) => {
                    const selectedGraduate = graduates.find(
                      (grad) => grad.name === selectedValue
                    );
                    if (selectedGraduate) {
                      this.setState({ searchTerm: selectedGraduate.name });
                      field.onChange(selectedGraduate.id);
                    }
                  }}
                  value={this.state.searchTerm || ""}
                  onInputChange={this.handleInputChange}
                  isLoading={loading}
                />
                </ScrollArea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="corporationIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Corporaciones</FormLabel>
              <FormControl>
                <Popover>
                  <div className="flex items-center space-x-2 h-[40px]">
                    <div className="w-6 h-6">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={(checked) =>
                          this.handleSelectAll(checked as boolean)
                        }
                        className="w-full h-full"
                      />
                    </div>
                    <PopoverTrigger asChild>
                      <button className="text-sm text-left w-full h-[40px] border rounded-md px-2 py-1">
                        Toda las corporaciones
                      </button>
                    </PopoverTrigger>
                  </div>
                  <PopoverContent className="w-40 border rounded-md z-10 p-4 shadow-lg">
                    <div className="max-h-80 overflow-auto">
                      {corporations.length > 0 ? (
                        corporations.map((corp) => (
                          <div
                            key={corp.id}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-5 h-5 mb-2">
                              <Checkbox
                                checked={selectedCorporations.includes(corp.id)}
                                onCheckedChange={(checked) =>
                                  this.handleCorporationSelect(
                                    corp.id,
                                    checked as boolean
                                  )
                                }
                                className="w-full h-full"
                              />
                            </div>
                            <label className="text-sm mb-2">{corp.name}</label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm">
                          No hay corporaciones disponibles.
                        </p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="numArrays"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Número de Cronogramas</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ingresa un número"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? "" : Number(value));
                  }}
                  value={
                    field.value === undefined || field.value === null
                      ? ""
                      : field.value
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="amountIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Cantidad por Corporación</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese las cantidades, separadas por comas"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                  }}
                  onBlur={() => {
                    if (typeof field.value === "string") {
                      const values = (field.value as string)
                        .split(",")
                        .map((val: string) => val.trim())
                        .filter((val: string) => val !== "")
                        .map((val: string) => Number(val))
                        .filter((val: number) => !isNaN(val));
                      field.onChange(values);
                    }
                  }}
                  value={
                    Array.isArray(field.value)
                      ? field.value.join(", ")
                      : field.value || ""
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }
}

export default ChildrenFormModule;
