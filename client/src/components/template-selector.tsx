import { CardTemplate, colorThemes } from '@/lib/card-templates';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Check, Palette } from 'lucide-react';

interface TemplateSelectorProps {
  templates: CardTemplate[];
  selectedTemplate: CardTemplate;
  selectedTheme: string;
  onSelectTemplate: (templateId: string) => void;
  onSelectTheme: (themeName: string) => void;
}

export function TemplateSelector({
  templates,
  selectedTemplate,
  selectedTheme,
  onSelectTemplate,
  onSelectTheme,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          Choose Card Type
        </h3>
        <ScrollArea className="h-[300px] pr-4">
          <div className="grid gap-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate.id === template.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onSelectTemplate(template.id)}
                data-testid={`template-${template.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{template.icon}</span>
                      <h4 className="font-semibold text-lg">{template.name}</h4>
                      {selectedTemplate.id === template.id && (
                        <Badge variant="default" className="ml-auto">
                          <Check className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.slice(0, 4).map((field) => (
                        <Badge key={field.key} variant="outline" className="text-xs">
                          {field.label}
                        </Badge>
                      ))}
                      {template.fields.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.fields.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Color Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Choose Color Theme
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(colorThemes).map(([key, theme]) => (
            <Button
              key={key}
              variant={selectedTheme === key ? 'default' : 'outline'}
              className="h-auto p-3 flex flex-col items-center gap-2"
              onClick={() => onSelectTheme(key)}
              data-testid={`theme-${key}`}
            >
              <div
                className="w-full h-8 rounded-md shadow-inner"
                style={{
                  background: theme.gradient,
                }}
              />
              <span className="text-xs font-medium">{theme.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}