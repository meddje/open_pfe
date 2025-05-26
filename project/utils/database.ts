import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Open or create the database
export async function openDatabase() {
  if (Platform.OS === 'web') {
    // SQLite is not available on web, return a mock implementation
    return mockDatabase();
  }
  
  return SQLite.openDatabase('objectdetection.db');
}

// Mock database for web platform
function mockDatabase() {
  const tables: Record<string, any[]> = {};
  
  return {
    transaction: (callback: (tx: any) => void) => {
      const tx = {
        executeSql: (
          sqlStatement: string,
          args: any[] = [],
          success?: (tx: any, resultSet: any) => void,
          error?: (error: any) => void
        ) => {
          console.log('Mock SQL:', sqlStatement, args);
          
          try {
            // Very basic SQL parsing for mock data
            if (sqlStatement.toLowerCase().startsWith('create table')) {
              const tableName = sqlStatement.match(/create table if not exists (\w+)/i)?.[1];
              if (tableName && !tables[tableName]) {
                tables[tableName] = [];
              }
              
              if (success) {
                success(tx, { rows: { length: 0, item: () => null } });
              }
            } 
            else if (sqlStatement.toLowerCase().startsWith('select')) {
              const tableName = sqlStatement.match(/from (\w+)/i)?.[1];
              
              if (tableName && tables[tableName]) {
                if (success) {
                  success(tx, {
                    rows: {
                      length: tables[tableName].length,
                      item: (index: number) => tables[tableName][index],
                      _array: tables[tableName],
                    },
                  });
                }
              } else {
                if (success) {
                  success(tx, { rows: { length: 0, item: () => null, _array: [] } });
                }
              }
            }
            else if (sqlStatement.toLowerCase().startsWith('insert')) {
              const tableName = sqlStatement.match(/into (\w+)/i)?.[1];
              
              if (tableName) {
                if (!tables[tableName]) {
                  tables[tableName] = [];
                }
                
                // Very simple mock insert
                const mockRow: Record<string, any> = {};
                const columns = sqlStatement.match(/\(([^)]+)\)/)?.[1].split(',').map(c => c.trim());
                
                if (columns) {
                  columns.forEach((col, index) => {
                    if (args[index] !== undefined) {
                      mockRow[col] = args[index];
                    }
                  });
                  
                  tables[tableName].push(mockRow);
                }
                
                if (success) {
                  success(tx, { insertId: tables[tableName].length - 1, rowsAffected: 1 });
                }
              }
            }
            else if (sqlStatement.toLowerCase().startsWith('update')) {
              const tableName = sqlStatement.match(/update (\w+)/i)?.[1];
              
              if (tableName && tables[tableName]) {
                // Very simple mock update - just acknowledge
                if (success) {
                  success(tx, { rowsAffected: 1 });
                }
              }
            }
          } catch (err) {
            console.error('Error in mock SQL execution:', err);
            if (error) {
              error(err);
            }
          }
        }
      };
      
      callback(tx);
    }
  };
}