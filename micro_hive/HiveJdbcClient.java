import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Time;
import java.sql.Timestamp;
import java.sql.Types;
import java.util.Vector;

import org.apache.commons.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONObject;

public class HiveJdbcClient {
	/**
	 * Wrapper entry
	 * @args jdbcUrl sql user password
	 */
	public static void main(String[] args) {
		
		if (args.length != 4) {
			LogFail("no args.");
		}
		
		// Decode args
		String jbdcUrl = null;
		String sql = null;
		String user = args[2];
		String password = args[3];
		try {
			jbdcUrl = new String(Base64.decodeBase64(args[0]), "UTF-8");
			sql = new String(Base64.decodeBase64(args[1]), "UTF-8");
		} catch (UnsupportedEncodingException e1) {
			LogFail("base64 decode fail.");
		}
		
		// Load hive2 driver
		try {
			Class.forName("org.apache.hive.jdbc.HiveDriver");
		} catch (ClassNotFoundException e) {
			LogFail("load driver fail.");
		}
		
		Connection con = null;
		Statement st = null;
		ResultSet res = null;
		
		JSONArray arr = new JSONArray();
		
		try {
			con = DriverManager.getConnection(jbdcUrl, user, password);
			st = con.createStatement();
			res = st.executeQuery(sql);
			ResultSetMetaData meta = res.getMetaData();
			Vector<Integer> types = new Vector<Integer>();
			Vector<String> names = new Vector<String>();
			int cnt = meta.getColumnCount();
			for (int i = 1; i <= cnt; i++) {
				types.add(meta.getColumnType(i));
				names.add(meta.getColumnLabel(i));
			}
			while(res.next()) {
				JSONObject obj = new JSONObject();
				for (int i = 1; i <= cnt; i++) {
				    switch(types.get(i-1)) {
				    case Types.BIT:
				    	obj.put(names.get(i-1), res.getBoolean(i));
				    	break;
				    case Types.TINYINT:
				    	obj.put(names.get(i-1), res.getShort(i));
				    	break;
				    case Types.SMALLINT:
				    	obj.put(names.get(i-1), res.getShort(i));
				    	break;
				    case Types.INTEGER:
				    	obj.put(names.get(i-1), res.getInt(i));
				    	break;
				    case Types.BIGINT:
				    	obj.put(names.get(i-1), res.getString(i));
				    	break;
				    case Types.FLOAT:
				    	obj.put(names.get(i-1), res.getFloat(i));
				    	break;
				    case Types.REAL:
				    	obj.put(names.get(i-1), res.getFloat(i));
				    	break;
				    case Types.DOUBLE:
				    	obj.put(names.get(i-1), res.getDouble(i));
				    	break;
				    case Types.NUMERIC:
				    	obj.put(names.get(i-1), res.getBigDecimal(i).doubleValue());
				    	break;
				    case Types.DECIMAL:
				    	obj.put(names.get(i-1), res.getBigDecimal(i).doubleValue());
				    	break;
				    case Types.CHAR:
				    	obj.put(names.get(i-1), res.getString(i));
				    	break;
				    case Types.VARCHAR:
				    	obj.put(names.get(i-1), res.getString(i));
				    	break;
				    case Types.LONGVARCHAR:
				    	obj.put(names.get(i-1), res.getString(i));
				    	break;
				    case Types.DATE:
				    	Date d = res.getDate(i);
				    	obj.put(names.get(i-1), d == null ? null : d.toString());
				    	break;
				    case Types.TIME:
				    	Time t = res.getTime(i);
				    	obj.put(names.get(i-1), t == null ? null : t.toString());
				    	break;
				    case Types.TIMESTAMP:
				    	Timestamp ts = res.getTimestamp(i);
				    	obj.put(names.get(i-1), ts == null ? null : ts.toString());
				    	break;
				    case Types.BOOLEAN:
				    	obj.put(names.get(i-1), res.getBoolean(i));
				    	break;
				    case Types.NCHAR:
				    	obj.put(names.get(i-1), res.getString(i));
				    	break;
				    case Types.NVARCHAR:
				    	obj.put(names.get(i-1), res.getString(i));
				    	break;
				    case Types.LONGNVARCHAR:
				    	obj.put(names.get(i-1), res.getString(i));
				    	break;
				    case Types.BINARY:
				    	obj.put(names.get(i-1), res.getBytes(i)); 
				    	break;			
				    case Types.VARBINARY:
				    	obj.put(names.get(i-1), res.getBytes(i)); 
				    	break;	
				    case Types.LONGVARBINARY:
				    	obj.put(names.get(i-1), res.getBytes(i)); 
				    	break;	
				    case Types.BLOB:
				    	obj.put(names.get(i-1), res.getBytes(i));
				    	break;
				    }
				}
				arr.put(obj);
			}
		} catch (SQLException e) {
			LogFail("connect hive fail" + e.getMessage());
		} finally { 
			if (res != null) {
				try {res.close();}catch(SQLException e) {}
			}
			if (st != null) {
				try {st.close();}catch(SQLException e) {}
			}
			if (con != null) {
				try {con.close();}catch(SQLException e) {}
			}
		}
		
		String resp = null;
        try {
			resp = Base64.encodeBase64String(arr.toString().getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) {
			LogFail("base64 resp fail "+e.getMessage());
		}
        
        System.out.print(resp);
	}
	
	public static void LogFail(String msg) {
		System.out.println("Error:" + msg);
		System.exit(-1);
	}
}