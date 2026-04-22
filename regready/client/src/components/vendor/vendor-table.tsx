import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, Mail, BarChart3, Check, X, AlertTriangle } from "lucide-react";
import type { Vendor } from "@shared/schema";

interface VendorTableProps {
  vendors: Vendor[];
  onViewVendor: (vendor: Vendor) => void;
}

const vendorIcons = {
  "Cloud Infrastructure": Cloud,
  "Email Marketing": Mail,
  "Web Analytics": BarChart3,
} as const;

const riskLevelConfig = {
  low: { color: "bg-success/10 text-success", label: "Low" },
  medium: { color: "bg-warning/10 text-warning", label: "Medium" },
  high: { color: "bg-error/10 text-error", label: "High" },
} as const;

export default function VendorTable({ vendors, onViewVendor }: VendorTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Vendor & Tool Compliance Status</h3>
          <Button variant="ghost" className="text-primary hover:text-blue-700">
            Manage Vendors
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Vendor/Tool
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                GDPR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                SOC 2
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {vendors.map((vendor) => {
              const Icon = vendorIcons[vendor.type as keyof typeof vendorIcons] || Cloud;
              const riskConfig = riskLevelConfig[vendor.riskLevel as keyof typeof riskLevelConfig];
              
              return (
                <tr key={vendor.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center mr-3">
                        <Icon className="text-neutral-600 w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{vendor.name}</p>
                        <p className="text-xs text-neutral-500">{vendor.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary" className={riskConfig.color}>
                      {riskConfig.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vendor.gdprCompliant ? (
                      <Check className="text-success w-5 h-5" />
                    ) : (
                      <X className="text-error w-5 h-5" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vendor.soc2Compliant ? (
                      <Check className="text-success w-5 h-5" />
                    ) : (
                      <X className="text-error w-5 h-5" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {new Date(vendor.lastAssessment).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewVendor(vendor)}
                      className="text-primary hover:text-blue-700"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
