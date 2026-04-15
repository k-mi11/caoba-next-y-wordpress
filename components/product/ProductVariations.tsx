'use client';

import { useState } from 'react';
import type { WooProductAttribute, WooProductVariation } from '@/lib/woocommerce/types';

type ProductVariation = WooProductVariation & {
  databaseId?: number;
  attributes: {
    nodes: WooProductAttribute[];
  };
};

type ProductAttribute = WooProductAttribute;

interface ProductVariationsProps {
  variations: ProductVariation[];
  defaultPrice: string;
  onVariationChange: (variation: ProductVariation | null) => void;
  mainAttributes?: any[]; // Add main product attributes
}

export function ProductVariations({ variations, defaultPrice, onVariationChange, mainAttributes }: ProductVariationsProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [currentVariation, setCurrentVariation] = useState<ProductVariation | null>(null);

  // Extraer atributos únicos (paño, color, talla, etc.)
  const getUniqueAttributes = () => {
    const attributeMap: Record<string, Set<string>> = {};

    // Primero procesar variaciones para obtener los nombres de atributos
    variations.forEach((variation) => {
      variation.attributes.nodes.forEach((attr) => {
        if (!attr.name) return;

        if (!attributeMap[attr.name]) {
          attributeMap[attr.name] = new Set();
        }
        
        // Agregar valores de variaciones si existen
        if (attr.value && attr.value.trim() !== '') {
          attributeMap[attr.name]?.add(attr.value);
        }
      });
    });

    // Siempre agregar opciones de los atributos principales
    if (mainAttributes && mainAttributes.length > 0) {
      mainAttributes.forEach((attr) => {
        if (!attr.name) return;

        // Crear el set si no existe
        if (!attributeMap[attr.name]) {
          attributeMap[attr.name] = new Set();
        }
        
        // Agregar opciones del atributo principal
        if (attr.options && Array.isArray(attr.options)) {
          attr.options.forEach((option: string) => {
            if (option && option.trim() !== '') {
              attributeMap[attr.name]?.add(option.trim());
            }
          });
        }
      });
    }

    return Object.entries(attributeMap).map(([name, values]) => ({
      name,
      values: Array.from(values).sort()
    }));
  };

  const attributes = getUniqueAttributes();
  
  // Debug: Log what attributes we found
  console.log('=== DEBUG ATTRIBUTES ===');
  console.log('Main attributes:', mainAttributes);
  console.log('Variations:', variations);
  console.log('Processed attributes:', attributes);
  console.log('=== END DEBUG ===');

  // Encontrar variación que coincide con los atributos seleccionados
  const findMatchingVariation = () => {
    if (Object.keys(selectedAttributes).length === 0) {
      return null;
    }

    return variations.find((variation) => {
      const attrs = variation.attributes.nodes;
      const matches = attrs.every(
        (attr) => attr.value && selectedAttributes[attr.name] === attr.value
      );
      return matches && attrs.length === Object.keys(selectedAttributes).length;
    });
  };

  const handleAttributeChange = (attributeName: string, value: string) => {
    console.log('=== HANDLE ATTRIBUTE CHANGE ===');
    console.log('Attribute:', attributeName, 'Value:', value);
    
    const newSelection = { ...selectedAttributes, [attributeName]: value };

    // Si deselecciona, remover del estado
    if (!value) {
      delete newSelection[attributeName];
    }

    console.log('New selection:', newSelection);
    setSelectedAttributes(newSelection);

    // Buscar variación que coincida
    const matchingVariation = variations.find((variation) => {
      const attrs = variation.attributes.nodes;
      console.log('Checking variation:', variation.name);
      console.log('Variation attributes:', attrs);
      
      const matches = Object.entries(newSelection).every(
        ([name, selectedValue]) => {
          const attr = attrs.find((a) => a.name === name);
          if (!attr) return false;
          
          // Si el valor de la variación está vacío, hacer match con cualquier valor del atributo principal
          if (!attr.value || attr.value.trim() === '') {
            // Buscar si el valor seleccionado existe en las opciones del atributo principal
            const mainAttr = mainAttributes?.find((ma) => ma.name === name);
            const match = mainAttr?.options?.includes(selectedValue);
            console.log(`Matching ${name}="${selectedValue}" with empty variation value using main options:`, match);
            return match;
          }
          
          // Si la variación tiene valor, hacer match directo
          const match = attr.value === selectedValue;
          console.log(`Matching ${name}="${selectedValue}" with variation value:`, match);
          return match;
        }
      );
      console.log('All attributes match:', matches, 'Attrs length:', attrs.length, 'Selection length:', Object.keys(newSelection).length);
      return matches && attrs.length === Object.keys(newSelection).length;
    });

    console.log('Matching variation found:', matchingVariation?.name || 'None');

    if (matchingVariation) {
      setCurrentVariation(matchingVariation);
      onVariationChange(matchingVariation);
    } else {
      setCurrentVariation(null);
      onVariationChange(null);
    }
    console.log('=== END HANDLE ATTRIBUTE CHANGE ===');
  };

  // Obtener valores disponibles para un atributo
  const getAvailableValues = (attributeName: string) => {
    return attributes.find((attr) => attr.name === attributeName)?.values || [];
  };

  // Verificar si una combinación está disponible
  const isValueAvailable = (attributeName: string, value: string) => {
    // Si es el único atributo seleccionado o no hay selecciones previas, todos los valores están disponibles
    const otherSelections = Object.entries(selectedAttributes).filter(([name]) => name !== attributeName);

    if (otherSelections.length === 0) {
      return true;
    }

    // Verificar si hay al menos una variación con este valor y las otras selecciones
    return variations.some((variation) => {
      const hasThisValue = variation.attributes.nodes.some(
        (attr) => attr.name === attributeName && attr.value === value
      );

      const matchesOtherSelections = otherSelections.every(([name, selectedValue]) =>
        variation.attributes.nodes.some(
          (attr) => attr.name === name && attr.value === selectedValue
        )
      );

      return hasThisValue && matchesOtherSelections;
    });
  };

  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {attributes.map((attr) => (
        <div key={attr.name} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Tallas
          </label>
          <select
            value={selectedAttributes[attr.name] || ''}
            onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm font-medium"
          >
            <option value="">Selecciona una talla</option>
            {attr.values.map((value) => {
              const isAvailable = isValueAvailable(attr.name, value);
              return (
                <option 
                  key={value} 
                  value={value}
                  disabled={!isAvailable}
                  className={!isAvailable ? 'text-gray-400' : 'text-gray-900'}
                >
                  {value}
                </option>
              );
            })}
          </select>
        </div>
      ))}
    </div>
  );
}
