export const tsxContent = (componentName: string) => {
  let typeName: any = `${componentName}Props`;
  typeName = typeName.split("");
  typeName[0] = typeName[0].toLocaleUpperCase();
  typeName = typeName.join("");
  return `
    interface ${typeName}Props {};

    const ${componentName} = (props: ${typeName}Props) => {
        return (
            <></>
        )
    }

    export default ${componentName}
    `;
};

export const jsxContent = (componentName: string) => {
  return `
      const ${componentName} = () => {
          return (
              <></>
          )
      }
  
      export default ${componentName}
      `;
};

export const vueTemplateContent = (componentName: string) => {
  return `
    <template><template>

    <script setup lang="js">
    import { defineComponent, defineProps, onMounted, defineExpose } from 'vue'
        defineComponent({
            name: '${componentName}',
        })
        defineProps({
            
        })

        onMounted(() => {
            
        })
        
        defineExpose({
            
        })
        import { ref } from 'vue'
    <script>

    <style scoped lang="scss"></style>
    `;
};

export const vueTsxContent = (componentName: string) => {
  return `
    import { defineComponent, ref } from 'vue'

    const ${componentName} = defineComponent({
        props: {},
        setup(props, context) {
            onMounted(() => {
                
            })
            context.expose({
                
            })
            return () => {
                return <div></div>
            }
        }
    })

    export default ${componentName}
    `;
};

export const classContent = (className: string) => {
  return `
    class ${className} {
    }

    export default ${className}
    `;
};
